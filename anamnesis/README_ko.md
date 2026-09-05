# Anamnesis — /recollect (ἀνάμνησις)

모호한 회상을 인지된 맥락으로 해소 (ἀνάμνησις: 상기, 떠올리기)

> [English](./README.md)

## Anamnesis란?

플라톤 ἀνάμνησις(상기)의 현대적 재해석 — **모호한 단서를 SSOT(세션 transcript)와 hypomnesis INDEX와 대조하여 — `memory/`는 스캔 대상이 아닌 사용자 큐레이션 adjunct — 각 후보의 원기록을 열어 단서가 닿는 발췌를 뽑고, 그 발췌를 출처와 함께 제시하여 사용자가 올바른 과거 맥락을 직접 식별하게 하는** 프로토콜 — 키워드 매칭 결과나 인덱스의 요약을 돌려주는 것이 아니라.

### 핵심 문제

AI 시스템은 모호한 회상 신호(`RecallAmbiguous`)를 놓치기 쉽습니다 — 사용자는 어떤 과거 세션·결정·산출물이 지금 관련 있다는 감각은 있지만, 구체적으로 그것을 지칭할 수 없습니다. 단서가 충분히 특정되지 않은 상태에서 키워드 검색은 너무 많거나 너무 적은 결과를 반환하고, 올바른 과거 맥락에 닿기 전에 신호가 유실됩니다.

### 해결책

**출처로 근거 지어진 인지(Source-grounded recognition)**: AI가 발화와 쌓인 맥락에서 단서를 읽고, hypomnesis INDEX와 세션 기록의 머리(spine)를 Salience 차원을 따라 뒤져 후보를 찾은 뒤, 1순위 후보의 원기록을 — 구성 세션마다 한 번씩 — 열어 단서가 닿는 발췌를 뽑습니다. 그 논의의 이야기를 기록의 말로(origin → direction → outcome; 한 세션 위에서는 라인·토픽·개념의 형태로), 발췌마다 출처와 resume 핸들을 붙여 보여 주고 턴을 넘깁니다. 사용자가 식별하거나, 자기 말로 단서를 고치면 검색이 다시 돕니다. INDEX의 서사는 회상을 깨우는 단서일 뿐 증거가 아니며, 증거는 발췌이고, 식별은 사용자의 것입니다. 구조화된 literal match는 source namespace가 회상 trace의 claim kind를 인가(authorize)할 때만 ranking anchor가 됩니다.

Claude Code와 Codex의 compact index가 모두 있으면 병렬로 검색하고 모든 후보에 출처를 유지합니다. 저장소 전체의 raw transcript를 훑는 것은 compact 검색이 빗나가고 사용자 왕복 한 번 — 열린 질문의 답, 또는 제시된 후보에 대한 교정 — 으로도 풀리지 않은 뒤 `/recollect`가 명시적으로 선택을 요청하는 2단계 확장이고, 제시할 후보가 가리키는 기록 하나를 여는 것은 유한하므로 그런 선택이 필요 없습니다.

### Codex 캡처 라이프사이클

공유 플러그인 훅은 Codex의 Stop, PreCompact, SessionEnd 이벤트를 `$CODEX_HOME/hypomnesis` 아래 fire-and-forget queue에 기록합니다. 분리된 worker는 transcript revision별로 이벤트를 합치고 `gpt-5.6-luna`를 `xhigh`로 실행해 compact record 하나를 추출한 다음, immutable generation을 쓰고 session pointer를 원자적으로 전환합니다. 중첩 추출은 ephemeral이며 hooks를 비활성화합니다. `agents/openai.yaml`은 skill discovery metadata만 제공하고, 훅 등록은 `hooks/hooks.json`에 남습니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 개시자 | 타입 시그니처 |
|----------|--------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| **Anamnesis** | **AI-guided** | **`RecallAmbiguous → RecalledContext`** |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |

**Anamnesis vs Aitesis** — 가장 가까운 이웃. 둘 다 정보 접근을 다루지만, 현상학적 판별이 다릅니다. Aitesis는 사용자가 알지 못하는 사실을 발견합니다(`ContextInsufficient` — "정보가 필요하다"). Anamnesis는 사용자가 존재한다는 것은 어렴풋이 아는 맥락을 확인합니다(`RecallAmbiguous` — "이거 어디서 다뤘던 것 같은데"). 충족을 기다리는 빈 지향(empty intention)이면 Anamnesis; 해당 주제에 지향 자체가 없으면 Aitesis.

**Anamnesis vs Periagoge** — 한 세션 위의 경계. 과거 세션이 이미 정착시킨 개념은 여기서 한 세션 위의 단위로 인지되고, 아직 이름 붙지 않은 사례들에서 형성 중인 개념은 Periagoge(`/induce`)가 결정화합니다. 정착한 것의 인지 → Anamnesis; 아직 이름 없는 것의 형성 → Periagoge.

## 프로토콜 흐름

```
Phase 0: Cue         → 빈 지향 감지; 단서와 그것이 가리키는 단위를 읽음 — 한 세션, 또는 그 위의 라인·토픽·개념 (silent)
Phase 1: Find+Ground → INDEX와 기록 머리에서 후보를 찾아 순위화; 1순위 후보의 원기록을 열어 단서가 닿는 발췌를 뽑음
Phase 2: Present     → 기록의 말로 된 이야기를 발췌마다 출처·resume 핸들과 함께 보여 주고 턴을 넘김 (모든 입도에서 같은 형태)
Phase 3: Resolve     → 사용자가 식별 → RecalledContext; 단서를 고침 → Find로 (세 번까지); 넘어감 → 종료
```

## Salience 차원

`MarkerProfile`의 여섯 차원 — 회상 후보를 찾고 순위화하는 데 사용.

| 차원 | 마커링 대상 |
|------|-------------|
| Coinage | 과거 논의를 고정하는 조어·신조어 — 전체 코퍼스에서는 희귀하지만 한 세션 내에서 반복되는 토큰 (Zipf 편차 신호) |
| Actor | 과거 맥락에 등장한 존재들 (사람, 시스템, 모듈, 파일) |
| Temporal | 시점 참조, 세션 날짜, 순서 단서 — 회상을 시간축에 배치 |
| Emotional | 정서적 마커 — 좌절, 놀람, 돌파 — 한 순간을 기억에 남게 하는 요소 |
| Cognitive | 추론 마커 — 내려진 결정, 해소된 트레이드오프, 도달한 깨달음 |
| Singularity | 일회성 사건·인시던트·예외적 에피소드 — 일상 논의와 구별되는 것들 |

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
