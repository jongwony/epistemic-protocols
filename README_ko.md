# Epistemic Protocols

> [English](./README.md)

각 프로토콜이 고유한 인지적 결핍을 해소하는 Claude Code 플러그인.

## 프로토콜

| 프로토콜 | 목적 | 적용 시점 |
|----------|------|----------|
| **[Mission](./prothesis)** (πρόθεσις) — Prothesis | 다관점 조사와 실행을 위한 팀 기반 분석 | 분석 시작 전 |
| **[Gap](./syneidesis)** (συνείδησις) — Syneidesis | 결정 지점에서 잠재적 갭 표면화 | 의사결정 시점 |
| **[Clarify](./hermeneia)** (ἑρμηνεία) — Hermeneia | 의도-표현 갭을 대화로 명확화 | 실행 전 |
| **[Grasp](./katalepsis)** (κατάληψις) — Katalepsis | AI 작업에 대한 확실한 이해 달성 | AI 작업 완료 후 |
| **[Goal](./telos)** (τέλος) — Telos | 모호한 의도에서 정의된 목표 공동 구성 | 실행 전 |

## 핵심 아이디어

각 프로토콜은 고유한 인지적 결핍을 해소합니다:

```
Protocol = (Deficit, Initiator, Operation, Operand) → Resolution
```

| 프로토콜 | 결핍 | 개시자 | 연산 | 타입 시그니처 |
|----------|------|--------|------|---------------|
| **Mission** | FrameworkAbsent | AI-detected | SELECT | `FrameworkAbsent → FramedInquiry` |
| **Gap** | GapUnnoticed | AI-detected | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Clarify** | IntentMisarticulated | User-initiated | EXTRACT | `IntentMisarticulated → ClarifiedIntent` |
| **Grasp** | ResultUngrasped | User-initiated | VERIFY | `ResultUngrasped → VerifiedUnderstanding` |
| **Goal** | GoalIndeterminate | AI-detected | CO-CONSTRUCT | `GoalIndeterminate → DefinedEndState` |

<img src="./assets/epistemic-matrix-ko.svg" alt="인식론적 타입 변환" width="560">

- **Mission**: "어떻게 접근할까?" → AI가 팀을 구성해 다관점으로 조사하고, 발견 사항에 따라 실행 (`FrameworkAbsent → FramedInquiry`)
- **Gap**: "뭘 놓쳤지?" → AI가 갭을 질문으로 표면화, 사용자가 판단 (`GapUnnoticed → AuditedDecision`)
- **Clarify**: "내가 뭘 말하려는 거지?" → AI가 해석 선택지 제시, 사용자가 의도 인식 (`IntentMisarticulated → ClarifiedIntent`)
- **Grasp**: "뭘 한 거야?" → AI가 질문으로 사용자의 이해를 검증 (`ResultUngrasped → VerifiedUnderstanding`)
- **Goal**: "내가 진짜 원하는 게 뭐지?" → AI가 목표를 제안, 사용자가 형성하고 승인 (`GoalIndeterminate → DefinedEndState`)

핵심 통찰: **Recall(회상)보다 Recognition(인지)**. 빈칸을 채우는 것보다 선택지에서 고르는 게 쉽습니다.

## 설치

```bash
# 마켓플레이스 등록
/plugin marketplace add https://github.com/jongwony/epistemic-protocols

# 필요한 것만 설치
/plugin install prothesis
/plugin install syneidesis
/plugin install hermeneia
/plugin install katalepsis
/plugin install telos
```

## 사용법

```
/mission [질문]      # 다관점 팀 조사 및 실행
/gap [작업]          # 실행 중 갭 표면화 활성화
/clarify [표현]      # 모호한 의도 명확화
/grasp               # AI 작업에 대한 이해 검증
/goal [모호한 아이디어]   # 의도에서 정의된 목표 공동 구성
```

## 라이선스

MIT
