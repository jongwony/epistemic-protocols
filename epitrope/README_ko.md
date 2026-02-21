# Epitrope — /calibrate (ἐπιτροπή)

컨텍스트 적응형 위임 캘리브레이션 (ἐπιτροπή: 맡김)

> [English](./README.md)

## Epitrope란?

그리스어 ἐπιτροπή(맡김)의 현대적 재해석 — **실행 컨텍스트를 탐지하고 적절한 진입 모드(Solo/TeamAugment/TeamCreate)를 선택한 후, 3차원(WHO/WHAT/HOW MUCH)으로 위임을 캘리브레이션하는** 프로토콜.

### 핵심 문제

AI 시스템은 암묵적인 위임 경계(`DelegationAmbiguous`)로 작동합니다 — 때로는 과도하게 자율적으로 행동하고(잘못된 접근, 과도한 변경), 때로는 불필요하게 허가를 구합니다. 명시적 캘리브레이션 없이는 AI가 위임 범위를 추측하여 마찰이 발생합니다.

### 해결책

**선언보다 캘리브레이션(Calibration over Declaration)**: 실행 컨텍스트를 탐지하여 진입 모드를 선택하고, 아키네이터식 시나리오 질문을 통해 구조(WHO), 범위(WHAT), 자율성(HOW MUCH) 3차원의 DelegationContract를 생성합니다.

### 다른 프로토콜과의 차이

| 프로토콜 | 모드 | 타입 시그니처 |
|----------|------|---------------|
| Aitesis | INQUIRE | `ContextInsufficient → InformedExecution` |
| **Epitrope** | **CALIBRATE** | **`DelegationAmbiguous → CalibratedDelegation`** |

**핵심 구분**: Aitesis는 "충분히 알고 있는가?"(맥락 갭)를 묻습니다. Epitrope는 "이렇게 해도 되는가?"(위임 갭)를 묻습니다. 맥락은 충분하지만 위임이 모호한 작업이 있을 수 있습니다.

## 프로토콜 흐름

```
Phase 0: Context Detection → 컨텍스트 탐지, 진입 모드 제안 (AskUserQuestion 호출)
Phase 1: Structure         → WHO: 팀 구조 + 작업 분해 (모드별)
Phase 2: Interview         → 시나리오 기반 위임 질문 (AskUserQuestion 호출)
Phase 3: Integration       → DelegationContract 갱신
Phase 4: Review            → 계약 승인 요청 (AskUserQuestion 호출)
Phase 5: Application       → DC를 팀에 적용 (팀 모드만)
```

## 행동 도메인

| 도메인 | 예시 |
|--------|------|
| FileModification | "파일 수정이 필요하면 바로 진행할까요, 먼저 물어볼까요?" |
| ↳ *ephemeral/durable* | "설정 파일, 규칙 등 영속 파일은 일반 코드와 다른 자율성이 필요할 수 있음" |
| Exploration | "조사 중 관련 정보를 발견하면..." |
| Strategy | "작업 중 더 나은 접근을 발견하면..." |
| External | "git push, PR 생성 — 항상 물어볼까요?" |

## 프로토콜 우선순위

```
Hermeneia → Telos → Epitrope → Aitesis → Prothesis → Syneidesis → Katalepsis
```

Epitrope는 Telos 다음: 목표가 정의된 후, 구조(WHO), 범위(WHAT), 자율성(HOW MUCH) 3차원으로 위임을 캘리브레이션합니다. 맥락 검증(Aitesis), 관점 프레이밍(Prothesis), 갭 감사(Syneidesis) 전에 AI의 권한 범위를 확정합니다.

## 사용 시기

**사용**:
- 다중 도메인 작업에서 자율성 기대가 불명확할 때
- 이전 상호작용에서 wrong_approach나 excessive_changes 마찰이 있었을 때
- 새로운 프로젝트나 익숙하지 않은 코드베이스에서 작업할 때
- AI 자율성 수준을 명시적으로 제어하고 싶을 때

**건너뛰기**:
- 작업 범위가 단계별 지시로 완전히 명시되어 있을 때
- 위임이 맥락에서 명확할 때 (단일 파일 편집, 명시적 요청)

## 사용법

```
/calibrate [작업 설명]
```

## 저자

Jongwon Choi (https://github.com/jongwony)
