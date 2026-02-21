# Telos — /goal (τέλος)

모호한 목표로부터 정의된 최종 상태를 공동 구축 (τέλος: 목적, 끝)

> [English](./README.md)

## Telos란?

그리스어 τέλος(목적, 끝)의 현대적 재해석으로, **이미 존재하는 목표를 추출하는 것이 아니라 아직 존재하지 않는 목표 정의를 함께 구축하도록 돕는** 프로토콜이다.

### 핵심 문제

사용자는 종종 모호한 열망(`GoalIndeterminate`)을 가지고 도착한다 — *무언가*를 원한다는 것은 알지만 성공이 어떤 모습인지, 어떤 경계가 적용되는지, 어떤 결과가 가장 중요한지 표현할 수 없다. 전통적 요구사항 수집은 의도가 이미 존재하며 추출만 하면 된다고 가정한다. 의도가 부재할 때, 추출은 조용히 실패한다.

### 해결책

**추출 대신 구축**: AI가 반증 가능한 목표 차원을 제안하고, 사용자가 선택, 거부, 또는 재구성한다. 불확정적 열망을 반복적 공동 구축을 통해 구체적이고 실행 가능한 최종 상태로 변환.

### 다른 프로토콜과의 차이

| 프로토콜 | 모드 | 타입 시그니처 |
|----------|------|---------------|
| Hermeneia | EXTRACT | `IntentMisarticulated → ClarifiedIntent` |
| **Telos** | **CO-CONSTRUCT** | **`GoalIndeterminate → DefinedEndState`** |

**핵심 구분**: Hermeneia는 사용자가 의도를 *가지고 있지만* 표현에 어려움을 겪는다고 가정한다 — Telos는 아직 잘 형성된 의도가 존재하지 않을 때 작동한다. Hermeneia는 추출하고, Telos는 구축한다.

### 요구사항 공학과의 차이

| 측면 | 요구사항 공학 | Telos |
|------|--------------|-------|
| 가정 | 이해관계자가 원하는 것을 안다 | 사용자가 아직 모를 수 있다 |
| 방법 | 도출 (필요 감지) | 선택 (차원 제안) |
| 산출물 | 요구사항 문서 | GoalContract (반증 가능) |
| 상호작용 | 인터뷰 기반 | 사상(morphism) 기반 (선택 시 차원 제안 발화) |

## 프로토콜 흐름

```
Phase 0: Trigger        → 목표 불확정성 감지 + 공동 구축 모드 확인
Phase 1: Dimension      → 갭 차원 제시 (call AskUserQuestion)
Phase 2: Co-construction → 반복적 제안을 통한 GoalContract 구축
Phase 3: Integration    → 선택 결과를 DefinedEndState로 통합
Phase 4: Sufficiency    → 완전성 검증 (call AskUserQuestion)
```

## 갭 유형

| 유형 | 예시 |
|------|------|
| Outcome | "성공이란 어떤 모습인가요: [옵션]?" |
| Metric | "진행을 어떻게 측정하시겠습니까: [옵션]?" |
| Boundary | "명시적으로 범위 밖인 것은: [옵션]?" |
| Priority | "X와 Y 중 어느 것이 더 중요합니까?" |

## 프로토콜 우선순위

```
Hermeneia → Telos → Prothesis → Syneidesis → Katalepsis
```

Telos는 Hermeneia 다음에 온다: 의도가 존재하지만 잘못 표현된 경우 먼저 명확화한다. 의도가 존재하지 않으면 공동 구축한다. 목표가 정의되면 관점 프레이밍(Prothesis)과 갭 감사(Syneidesis)를 진행할 수 있다.

## 사용 시기

**사용**:
- 모호한 열망은 있지만 구체적인 목표가 없을 때
- 성공이 어떤 모습인지 정의할 수 없을 때
- 무엇이 중요하고 무엇이 중요하지 않은지 결정하는 데 도움이 필요할 때
- 정의되지 않은 범위로 프로젝트를 시작할 때

**건너뛰기**:
- 목표가 명확하지만 표현이 부족할 때 (Hermeneia 사용 — /clarify)
- 정의된 목표가 있고 관점 분석이 필요할 때 (Prothesis 사용 — /frame)

## 사용법

```
/goal [모호한 목표 또는 열망]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
