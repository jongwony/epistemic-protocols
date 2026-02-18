# Aitesis — /inquire (αἴτησις)

실행 전 맥락 부족 감지 (αἴτησις: 요청)

> [English](./README.md)

## Aitesis란?

그리스어 αἴτησις(요청)의 현대적 재해석 — **AI가 충분한 맥락 없이 진행하는 대신, 부족한 것을 먼저 요청하는** 프로토콜.

### 핵심 문제

AI 시스템은 맥락이 불충분한 상태(`ContextInsufficient`)에서도 실행을 진행하는 경우가 많습니다 — 환경 제약이 변경되었거나, 사용자 불만 패턴이 방치되거나, 같은 동작이 반복적으로 실패하거나, 이전 가정이 더 이상 유효하지 않을 때. 묵시적 가정은 낭비와 오류 누적으로 이어집니다.

### 해결책

**가정보다 질의(Inquiry over Assumption)**: AI가 맥락 부족 지표를 감지하면, 사용자가 해결하거나 무시하거나 재정의할 수 있는 구조화된 미니 선택지를 표면화합니다. 표적화된 요청을 통해 불충분한 맥락을 정보에 기반한 실행으로 변환합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 모드 | 타입 시그니처 |
|----------|------|---------------|
| Syneidesis | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → InformedExecution`** |

**핵심 구분**: Syneidesis는 의사결정 시점에서 사용자가 판단할 갭을 표면화합니다(메타인지 — 사용자의 결정 품질 모니터링). Aitesis는 실행 전에 AI 자체의 맥락 부족을 감지합니다(이타인지 — "내가 충분한 맥락을 가지고 있는가?").

## 프로토콜 흐름

```
Phase 0: Gate           → 맥락 부족 지표 감지 (무성)
Phase 1: Surfacing      → 최우선 갭 후보 제시 (AskUserQuestion 호출)
Phase 2: Integration    → 사용자 응답으로 실행 계획 갱신
```

## 갭 유형

| 유형 | 예시 |
|------|------|
| ConstraintDrift | "이전 논의 이후 설정이 변경되었습니다 — ..." |
| DissatisfactionSignal | "여러 번 수정하신 것 같습니다 — ..." |
| FailurePattern | "이 접근이 반복적으로 실패했습니다 — 원인은..." |
| AssumptionStale | "이전에 X를 가정했는데 — Y를 고려하면 재검토할까요?" |

## 프로토콜 우선순위

```
Hermeneia → Telos → Aitesis → Prothesis → Syneidesis → Katalepsis
```

Aitesis는 Telos 다음: 목표가 정의된 후, 실행 맥락이 충분한지 확인합니다. 관점 프레이밍(Prothesis)과 갭 감사(Syneidesis) 전에 AI가 필요한 맥락을 갖추도록 합니다.

## 사용 시기

**사용**:
- AI가 오래된 가정으로 작동하는 것 같을 때
- 같은 접근이 계속 실패할 때
- 세션 중간에 환경이나 제약이 변경되었을 때
- AI가 묵시적 가정을 하고 있다고 느낄 때

**건너뛰기**:
- 실행 맥락이 완전히 명시되어 있을 때 (관점 분석은 Prothesis — /mission)
- 갭이 실행 맥락이 아닌 의사결정 시점에 있을 때 (Syneidesis — /gap)

## 사용법

```
/inquire [현재 작업 또는 맥락]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
