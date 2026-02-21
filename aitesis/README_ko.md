# Aitesis — /inquire (αἴτησις)

실행 전 맥락 부족 감지 (αἴτησις: 요청)

> [English](./README.md)

## Aitesis란?

그리스어 αἴτησις(요청)의 현대적 재해석 — **실행 전에 맥락 충분성을 사전 스캔하고, 코드베이스 탐색으로 자체 조사한 뒤, 해결되지 않은 부분만 사용자에게 요청하는** 프로토콜.

### 핵심 문제

AI 시스템은 맥락이 불충분한 상태(`ContextInsufficient`)에서도 실행을 진행하는 경우가 많습니다 — 필요한 도메인 지식이 없거나, 암묵적 요구사항이 검증되지 않거나, 환경 의존성을 가정하거나, 범위가 모호할 때. 묵시적 가정은 낭비와 오류 누적으로 이어집니다.

### 해결책

**가정보다 질의(Inquiry over Assumption)**: 실행 전에 AI가 맥락 갭을 스캔하고, 코드베이스 탐색으로 자체 해결을 시도한 뒤, 남은 갭을 구조화된 미니 선택지로 사용자에게 표면화합니다. 표적화된 요청을 통해 불충분한 맥락을 정보에 기반한 실행으로 변환합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 모드 | 타입 시그니처 |
|----------|------|---------------|
| Syneidesis | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Aitesis** | **INQUIRE** | **`ContextInsufficient → InformedExecution`** |

**핵심 구분**: Syneidesis는 의사결정 시점에서 사용자가 판단할 갭을 표면화합니다 — 정보 흐름 AI→사용자 (메타인지). Aitesis는 실행 전에 AI 자체의 맥락 부족을 감지합니다 — 정보 흐름 사용자→AI (이타인지: "내가 충분한 맥락을 가지고 있는가?").

## 프로토콜 흐름

```
Phase 0: Gate              → 맥락 충분성 스캔 (무성)
Phase 1: Self-Investigation → Read/Grep 코드베이스 탐색으로 갭 자체 해결
Phase 2: Surfacing          → 남은 갭 제시 (AskUserQuestion 호출)
Phase 3: Integration        → 사용자 응답으로 실행 계획 갱신
```

## 갭 식별

갭은 작업별로 동적 식별 — 고정 분류 없음:

| 심각도 | 기준 | 예시 |
|--------|------|------|
| **Blocking** | 해결 없이 실행 불가 | "어떤 데이터베이스 스키마 버전을 대상으로 해야 하나요?" |
| **Important** | 해결 없이 차선 결과 위험 | "REST와 GraphQL 엔드포인트가 모두 존재합니다 — 이 서비스는 어떤 API 레이어를 사용하나요?" |
| **Minor** | 합리적 기본값 존재 | "이 파일에 탭과 스페이스 중 어떤 걸 선호하시나요?" |

## 프로토콜 우선순위

```
Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Katalepsis
```

Aitesis는 Epitrope 다음: 위임이 캘리브레이션된 후, 실행 맥락이 충분한지 확인합니다. 관점 프레이밍(Prothesis)과 갭 감사(Syneidesis) 전에 AI가 필요한 맥락을 갖추도록 합니다.

## 사용 시기

**사용**:
- AI에게 도메인 맥락이 부족할 수 있는 복잡한 작업 전
- 암묵적 요구사항이나 환경 의존성이 있는 작업일 때
- 범위가 모호하여 AI가 가용 맥락에서 의도된 접근 방식을 판단할 수 없을 때
- 세션에서 이전에 다루지 않은 새로운 도메인에 진입할 때

**건너뛰기**:
- 실행 맥락이 완전히 명시되어 있을 때 (관점 분석은 Prothesis — /frame)
- 갭이 실행 맥락이 아닌 의사결정 시점에 있을 때 (Syneidesis — /gap)
- 위임 범위가 불명확할 때 (Epitrope — /calibrate 먼저)

## 사용법

```
/inquire [현재 작업 또는 맥락]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
