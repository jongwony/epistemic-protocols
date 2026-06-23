# Prothesis — /frame (πρόθεσις)

다관점 프레이밍 — 상세 렌즈, 또는 격리 실행을 위해 넘기는 렌즈↔substrate 쌍 (πρόθεσις: 앞에 놓기)

> [English](./README.md)

## Prothesis란?

그리스어 πρόθεσις(앞에 놓기)의 현대적 재해석으로, **분석 렌즈를 사용자 앞에 놓고, 선택된 각 렌즈마다 그 렌즈가 필요로 하는 substrate를 선언**한 뒤 렌즈↔substrate 쌍을 넘기는 **순수 렌즈 형성 도구**다. frame은 분석 객체(렌즈)와 그 substrate 필요 + channel 필요를 형성한 뒤, isolation + 배열(arrangement) + reconciliation + 합성(synthesis) 장치를 위해 `/conduct`를 넛지한다 — 그 장치는 `/conduct`가 설계하고 격리된 substrate가 실행한다. frame은 isolation을 실현하지도, 자기 컨텍스트 안에서 다관점 결과를 합성하지도 않는다 — 수렴(convergence)은 렌즈들을 진정한 격리 상태에서 실행한 substrate만이 주장할 수 있다.

### 핵심 문제

사용자는 종종 질문에 적합한 분석 프레임워크가 부재한 상태다 (`FrameworkAbsent`). 열린 질문 "어떤 관점을 원하세요?"는 이미 답을 알아야 대답할 수 있다. 관점 선택을 넘어서, 복잡한 질문은 고유한 시점에서의 격리 조사가 필요하며 — 한 컨텍스트가 모든 관점을 추론한 뒤 "수렴했다"고 주장하면 그 합의는 구조적으로 보장된 것(합의로 포장된 편향)이다. 따라서 진정한 다관점 작업은 각 렌즈가 자기 substrate에서 실행될 것을 요구한다.

### 해법

**Recognition over Recall + Substrate-Correspondence** (frame은 렌즈를 형성하고 handoff할 뿐, isolation도 실행도 배열도 합성도 하지 않음):
- 선택된 각 렌즈마다 frame은 **`substrate_need`**(그 렌즈가 필요로 하는 권위적 추상 페르소나/역량 — 구체 에이전트는 절대 바인딩하지 않음)와 **`binding_hints`**(권고적·열거형 후보 substrate 목록; skill 번들 에이전트 우선)를 선언한다. 힌트가 필요한 이유: 그렇지 않으면 호스트는 `general-purpose`로 기본 폴백하며 전문화된 에이전트를 놓친다.
- **LensReturn**: 단일 렌즈(또는 전문화된 substrate가 불필요한 렌즈들)는 상세 렌즈로 직접 반환된다 — 합성 없음, 수렴 주장 없음.
- **SubstrateCorrespondence**: 적어도 하나가 전문 substrate를 필요로 하는 ≥2개 렌즈는 렌즈↔substrate 쌍이 되어, isolation + 배열 + reconciliation + 합성 장치를 담은 **`/conduct` 넛지와 함께** 넘겨진다. `/conduct`가 그 배열을 설계하고 substrate(에이전트 팀, dynamic-workflow, 격리 subagent, 또는 plan mode)가 각 렌즈를 격리 상태에서 실행한 뒤 수렴을 주장할 수 있다 (main 세션이 substrate일 때는 격리 실행자를 선출하는 오케스트레이터로서만 가능하며, 자기 컨텍스트 안에서 렌즈를 인라인으로 격리하지 않는다); frame은 `/conduct`를 넛지하고 handoff에서 정지한다.

### 소크라테스 방식과의 차이

| 차원 | 소크라테스 산파술 | Prothesis |
|------|------------------|-----------|
| 지식 원천 | 대화자 내부에 잠재 | 외부에서 제공 |
| 전제 | "당신은 이미 알고 있다" | "당신은 옵션을 모른다" |
| 역할 | 산파 (끌어냄) | 지도 제작자 (경로 공개) |
| 질문 형태 | 열린 질문 (회상 부담) | 선택지 (인지만 필요) |

## 프로토콜 흐름

```
Phase 0: Mission Brief → 탐구 의도, 범위 확인 (gate interaction; 모드 질문 없음)
Phase 1: Gather        → 관점 형성을 위한 대상 맥락 수집
Phase 2: Prothesis     → 관점 2-4개 제시 (gate interaction); 단일 렌즈도 유효
Phase 3: Bind Substrate & Handoff →
  bind_substrate: 렌즈마다 substrate_need(권위적) + binding_hints(권고적) + channel_need 선언
  단일 렌즈 ∨ 전문 substrate 불필요 → LensReturn(상세 렌즈) → STOP
  적어도 하나가 전문 substrate를 필요로 하는 ≥2개 렌즈   → SubstrateCorrespondence(렌즈↔substrate 쌍)
                                     ⊕ /conduct 넛지 → handoff → STOP
--- frame은 isolation도 배열도 실행도 합성도 하지 않음: isolation + 배열 + 합성 장치는
    /conduct가 (넛지를 통해) 설계하고 격리된 substrate가 실행하는 몫 ---
```

## 사용 시점

**사용**:
- 평가, 비교, 추천 요청
- "전문가 관점에서", "심층 분석" 등 다양한 프레임워크가 가능할 때

**생략**:
- 단순 사실 질문
- 사용자가 이미 관점을 명시했을 때

## 사용법

```
/frame [질문]                        # 다관점 프레이밍
```

## 저자

Jongwon Choi (https://github.com/jongwony)
