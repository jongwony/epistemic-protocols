# Epharmoge — /contextualize (ἐφαρμογή)

실행 후 적용-맥락 불일치 탐지 (ἐφαρμογή: 적용, 맞춤)

> [English](./README.md)

## Epharmoge란?

그리스어 ἐφαρμογή(적용/맞춤)의 현대적 재해석으로, **기술적으로 올바른 AI 출력이 실제 적용 맥락에 맞지 않을 수 있는 경우를 탐지하여**, 적합성을 가정하지 않고 근거와 함께 불일치를 사용자 판단에 제시하는 프로토콜이다.

### 핵심 문제

AI는 올바른 결과를 생성하지만, 올바름만으로는 적용 가능성이 보장되지 않는다(`ApplicationDecontextualized`). 환경 가정, 관례 불일치, 범위 초과 등이 기술적으로 올바른 출력을 대상 맥락에 부적합하게 만들 수 있다. 실행 후 적용 가능성 검증 없이는 사용자가 숨겨진 맥락 격차를 그대로 물려받게 된다.

### 해결책

**올바름보다 적용 가능성**: 실행 후 AI가 결과가 적용 맥락에 맞는지 평가한다. 불일치가 감지되면 근거와 함께 제시하고, 사용자가 적응 필요 여부를 판단한다. 탈맥락화된 실행을 맥락화된 실행으로 변환한다.

### 다른 프로토콜과의 차이

| 프로토콜 | 주도자 | 타입 시그니처 |
|----------|--------|---------------|
| Prothesis | AI-guided | `FrameworkAbsent → FramedInquiry` |
| Syneidesis | AI-guided | `GapUnnoticed → AuditedDecision` |
| Hermeneia | Hybrid | `IntentMisarticulated → ClarifiedIntent` |
| Telos | AI-guided | `GoalIndeterminate → DefinedEndState` |
| Aitesis | AI-guided | `ContextInsufficient → InformedExecution` |
| Prosoche | User-initiated | `ExecutionBlind → SituatedExecution` |
| **Epharmoge** | **AI-guided** | **`ApplicationDecontextualized → ContextualizedExecution`** |
| Katalepsis | User-initiated | `ResultUngrasped → VerifiedUnderstanding` |

### Aitesis와의 차이

| 관점 | Aitesis | Epharmoge |
|------|---------|-----------|
| 타이밍 | 실행 전 | 실행 후 |
| 방향 | User → AI (맥락 제공) | AI → User (적용 가능성 확인) |
| 축 | Context fitness | Context fitness |
| 결핍 | `ContextInsufficient` | `ApplicationDecontextualized` |
| 해소 | `InformedExecution` | `ContextualizedExecution` |

같은 축(context fitness), 반대 타이밍, 반대 방향. Aitesis는 "실행을 잘 하기 위한 충분한 맥락이 있는가?"를 묻고, Epharmoge는 "실행 결과가 실제로 맥락에 맞는가?"를 묻는다. 상호 보완적이지, 중복이 아니다.

## 프로토콜 흐름

```
Phase 0: Applicability Gate → 결과를 맥락 대비 평가 (비표시)
Phase 1: Mismatch Surfacing → 근거 제시 (gate interaction)
Phase 2: Result Adaptation  → 사용자 지시에 따른 적응 적용
```

## 불일치 신호

| 신호 | 탐지 |
|------|------|
| 환경 가정 | 결과가 현재 맥락에서 검증되지 않은 환경 상태를 가정 |
| 관례 불일치 | 결과가 일반적 모범 사례를 따르지만 프로젝트에 로컬 관례가 존재 |
| 범위 초과 | 결과가 관찰된 사용 사례가 요구하는 것보다 많거나 적게 다룸 |
| 시간적 맥락 | 결과가 변경되었을 수 있는 버전, 상태, 단계에 적용 |

## 사용 시기

**사용**:
- AI 실행 후 맥락에 대한 적용 가능성이 불확실할 때
- 환경 가정이 대상과 맞지 않을 수 있을 때
- 관례 불일치가 의심될 때
- 출력 범위가 원래 요청을 초과할 수 있을 때

**건너뛰기**:
- 명시적 사양을 제공했고 결과가 정확히 따를 때
- 실행이 사소하거나 기계적일 때 (포맷팅, 오타 수정)
- 결과가 분명히 맥락에 잘 맞을 때

## 상태

**조건부** — AI 주도 활성화(Layer 2)는 실행 전/후 context fitness 축을 검증하기 위해 Aitesis 운영 경험이 필요하다. `/contextualize`를 통한 사용자 호출은 이 게이트와 관계없이 항상 사용 가능하다.

## 사용법

```
/contextualize
```

## 저자

Jongwon Choi (https://github.com/jongwony)
