# Analogia — /ground (ἀναλογία)

도메인 간 구조적 대응 검증 (ἀναλογία: 유비, 유추)

> [English](./README.md)

## Analogia란?

그리스어 ἀναλογία(유비, 유추)의 현대적 재해석으로, **추상 프레임워크가 실제로 내 구체적 상황에 대응되는지 검증**하여, 확인된 구조적 대응을 생성하는 프로토콜이다.

### 핵심 문제

AI는 한 도메인의 패턴, 모델, 유비를 다른 도메인에 적용하면서 구조적 대응이 성립하는지 확인하지 않는다. Strangler Fig 마이그레이션 패턴이 맞는 것 같지만 — 서비스가 단일 DB를 공유하는 모놀리스에서도 맞는가? 구조적으로 맞지 않는 추상적 조언은 구현 단계에서 낭비를 초래한다.

### 해결책

**추상적 주장 대신 구조적 대응**: AI 출력이 추상 프레임워크를 내 도메인에 적용할 때, Analogia는 추상과 구체 도메인을 분해하고, 명시적 대응을 구성하여, 구체적 인스턴스화를 제시한다. "이 패턴이 적용된다"고 단언하는 대신, 각 추상 구성요소가 내 상황에 어떻게 대응되는지(또는 대응이 실패하는지) 보여준다.

### 다른 프로토콜과의 차이

| 프로토콜 | 주도자 | 타입 시그니처 |
|----------|--------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Hermeneia | Hybrid | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI-guided | `GoalIndeterminate → DefinedEndState` |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| **Analogia** | **AI-guided** | **`MappingUncertain → ValidatedMapping`** |
| Prosoche | User-initiated | `ExecutionBlind → SituatedExecution` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

**핵심 차이**:
- **vs. Prothesis**: Prothesis는 프레임워크가 없을 때 어떤 것을 적용할지 선택한다. Analogia는 선택된 프레임워크가 내 도메인에 구조적으로 대응되는지 검증한다.
- **vs. Aitesis**: Aitesis는 실행을 위한 맥락이 충분한지 확인한다 (사실 관계). Analogia는 추상 구조가 내 맥락에 대응될 때 보존되는지 확인한다 (관계 구조).
- **vs. Epharmoge**: Epharmoge는 실행 후 적용성을 확인한다. Analogia는 실행 전 추상화 수준 간 대응 유효성을 확인한다.

**판별 기준**: 불확실성이 *추상 구조 A가 구체 구조 B에 대응되는가*에 관한 것이면 Analogia다. *실행을 위한 맥락이 충분한가*에 관한 것이면 Aitesis다. *어떤 프레임워크를 적용할지*에 관한 것이면 Prothesis다.

## 프로토콜 흐름

```
Phase 0: Gate         → AI 출력의 대응 불확실성 감지 (비표시)
Phase 1: Decompose    → 추상 + 구체 도메인 식별, 구조적 대응 구성
Phase 2: Validate     → 구체적 인스턴스화 제시 및 사용자 검증 (AskUserQuestion)
Phase 3: Integrate    → 명시적 대응 상태로 출력 업데이트
```

## 대응 검증

| 검증 | 행동 |
|------|------|
| **Confirm** | 대응이 정확함 — 대응 검증 완료 |
| **Adjust** | 대응에 개선이 필요 — 피드백 제공, Phase 1로 복귀 |
| **Dismiss** | 이 대응은 추가 검증이 불필요 |

## 사용 시점

**사용**:
- AI가 패턴이나 아키텍처를 추천하지만 내 코드베이스에 맞는지 확신이 없을 때
- 추상적 조언이 이론적으론 맞는데 내 맥락에서 불명확할 때
- 도메인 간 유비가 구체적 검증 없이 적용될 때
- "내 상황에 이게 어떻게 적용되는지 보여줘"라고 할 때

**건너뛰기**:
- AI 출력이 이미 구체적 예시와 함께 도메인 특정적일 때
- 대응을 이미 이해할 때 ("이게 어떻게 적용되는지 알아")
- 추상 프레임워크가 적용되지 않을 때 (출력이 순수 구체적일 때)

## 사용법

```
/ground [검증할 AI 출력]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
