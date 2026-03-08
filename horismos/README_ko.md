# Horismos — /bound (ὁρισμός)

결정마다 인식론적 경계를 정의 (ὁρισμός: 경계 짓기)

> [English](./README.md)

## Horismos란?

그리스어 ὁρισμός(경계 짓기)에 기반한 프로토콜로, **각 결정에서 사용자와 AI 사이의 인식론적 경계를 정의**하여 BoundaryMap을 생성합니다.

### 핵심 문제

사용자와 AI는 종종 누가 무엇을 아는지에 대한 명확한 경계 없이 작업합니다(`BoundaryUndefined`). 이는 AI가 사용자에게 없는 전문성을 가정하거나, AI가 처리해야 할 질문을 사용자에게 묻는 상황을 초래합니다.

### 해결책

**가정 대신 정의**: AI가 경계가 정의되지 않은 영역을 감지하고, 사용자가 아는 것과 AI가 판단할 것의 경계를 정의하도록 안내합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 시작자 | 타입 시그니처 |
|----------|--------|---------------|
| Prothesis | AI 주도 | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI 주도 | `GapUnnoticed → AuditedDecision` |
| Hermeneia | 하이브리드 | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI 주도 | `GoalIndeterminate → DefinedEndState` |
| **Horismos** | **AI 주도** | **`BoundaryUndefined → DefinedBoundary`** |
| Aitesis | AI 주도 | `ContextInsufficient → InformedExecution` |
| Analogia | AI 주도 | `MappingUncertain → ValidatedMapping` |
| Prosoche | 사용자 주도 | `ExecutionBlind → SituatedExecution` |
| Epharmoge | AI 주도 | `ApplicationDecontextualized → ContextualizedExecution` |
| Katalepsis | 사용자 주도 | `ResultUngrasped → VerifiedUnderstanding` |

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install horismos@epistemic-protocols
```

## 사용법

```
/bound [경계를 정의할 작업 범위]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
