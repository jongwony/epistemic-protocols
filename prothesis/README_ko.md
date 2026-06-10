# Prothesis — /frame (πρόθεσις)

다관점 프레이밍 — 렌즈 추천 또는 substrate로 넘기는 컴파일된 inquiry 스펙 (πρόθεσις: 앞에 놓기)

> [English](./README.md)

## Prothesis란?

그리스어 πρόθεσις(앞에 놓기)의 현대적 재해석으로, **분석 렌즈를 추천하거나 다관점 inquiry 스펙을 컴파일**한 뒤 substrate로 넘겨 실행시키는 프로토콜이다. frame은 분석 객체(렌즈)를 공급하며, 다관점 배열은 `/conduct`의 몫, inquiry 실행은 substrate의 몫이다.

### 핵심 문제

사용자는 종종 질문에 적합한 분석 프레임워크가 부재한 상태다 (`FrameworkAbsent`). 열린 질문 "어떤 관점을 원하세요?"는 이미 답을 알아야 대답할 수 있다. 관점 선택을 넘어서, 복잡한 질문은 고유한 시점에서의 병렬 조사를 위한 스펙이 필요하며 — 그 스펙을 어떤 substrate가 실행한다.

### 해법

**Recognition over Recall + Two Modes** (둘 다 출력을 컴파일해 handoff; 어느 쪽도 실행하지 않음):
- **Recommend** (Mode 1): AI가 관점 옵션을 제시하고, 사용자가 선택하면, 렌즈 추천 + 후속 프로토콜 추천을 출력한다. 경량 경로 — inquiry 스펙 없음. Phase 0에서 Mode 선택으로 진입.
- **Inquire** (Mode 2): AI가 관점을 제시하고, 사용자가 선택하면, frame이 전체 inquiry 스펙 — 렌즈 + 기본 격리/대화/합성 directive + 비자명 배열용 `/conduct` 참조 — 을 컴파일해 handoff한다. substrate(에이전트 팀, dynamic-workflow, 격리 subagent, plan mode, 또는 main 세션)가 이를 실행하며, frame은 handoff에서 정지한다.

### 소크라테스 방식과의 차이

| 차원 | 소크라테스 산파술 | Prothesis |
|------|------------------|-----------|
| 지식 원천 | 대화자 내부에 잠재 | 외부에서 제공 |
| 전제 | "당신은 이미 알고 있다" | "당신은 옵션을 모른다" |
| 역할 | 산파 (끌어냄) | 지도 제작자 (경로 공개) |
| 질문 형태 | 열린 질문 (회상 부담) | 선택지 (인지만 필요) |

## 프로토콜 흐름

```
Phase 0: Mission Brief → 탐구 의도, 범위, 모드 확인 (gate interaction)
Phase 1: Gather        → 관점 형성을 위한 대상 맥락 수집
Phase 2: Prothesis     → 관점 2-4개 제시 (gate interaction)
Phase 3: Compile & Handoff →
  Mode 1 (recommend): 렌즈 분류(characterize) → 추천 출력 → STOP
  Mode 2 (inquire):   inquiry 스펙 컴파일(렌즈 ⊕ /conduct 배열 참조 ⊕
                      기본 격리/대화/합성 directive) → handoff → STOP
--- frame은 실행하지 않음: substrate가 스펙을 실행하고, 비자명 배열은 /conduct로 라우팅 ---
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
