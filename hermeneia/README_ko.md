# Hermeneia — /clarify (ἑρμηνεία)

대화를 통한 의도-표현 갭 명확화 (ἑρμηνεία: 해석)

> [English](./README.md)

## Hermeneia란?

그리스어 ἑρμηνεία(해석)의 현대적 재해석으로, **사용자가 이미 알고 있지만 표현하기 어려운 것을 명확히 표현하도록 돕는** 프로토콜이다.

### 핵심 문제

사용자는 종종 자신의 표현이 모호하다는 것을 인식하지만(`IntentMisarticulated`), 명확히 하기 위한 어휘나 구조가 부족하다. "무슨 뜻이에요?"와 같은 열린 질문은 사용자가 이미 자신이 불명확하다는 것을 알고 있을 때 도움이 되지 않는다.

### 해결책

**가정 대신 표현 지원**: AI가 해석 옵션을 제시하고, 사용자가 선택지 중에서 자신의 실제 의도를 인식한다. 자각된 모호함을 정확한 표현으로 변환.

### 다른 프로토콜과의 차이

| 프로토콜 | 주도자 | 타입 시그니처 |
|----------|--------|---------------|
| Prothesis | AI 감지 | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI 감지 | `GapUnnoticed → AuditedDecision` |
| **Hermeneia** | **Hybrid** | **`IntentMisarticulated → ClarifiedIntent`** |

## 프로토콜 흐름

```
Phase 0: Trigger       → 명확화 요청 인식 (사용자 주도 또는 AI 모호성 감지)
Phase 1: Diagnosis     → 의도-표현 갭 식별 (비표시)
Phase 2: Clarification → 옵션 제시 (call AskUserQuestion)
Phase 3: Integration   → 명확화된 표현으로 진행
```

## 갭 유형

| 유형 | 예시 |
|------|------|
| Expression | "X를 의미하셨나요, Y를 의미하셨나요?" |
| Precision | "구체적으로 어느 정도: [옵션]?" |
| Coherence | "X를 언급하셨지만 Y도..." |
| Context | "이것의 맥락이 무엇인가요?" |

## 사용 시기

**사용**:
- 표현이 모호할 수 있다고 인식할 때
- 요청을 어떻게 표현해야 할지 확실하지 않을 때
- 의도를 명확히 표현하는 데 도움이 필요할 때
- AI가 표현 모호성을 감지하여 명확화를 제안할 때 (사용자 확인 후 진행)

**건너뛰기**:
- 표현이 명확할 때
- AI가 맥락에서 추론해야 할 때

## 사용법

```
/clarify [잠재적으로 모호한 요청]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
