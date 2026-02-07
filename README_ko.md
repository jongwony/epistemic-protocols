# Epistemic Protocols

> [English](./README.md)

각 프로토콜이 고유한 인지적 결핍을 해소하는 Claude Code 플러그인.

## 프로토콜

| 프로토콜 | 목적 | 적용 시점 |
|----------|------|----------|
| **[Prothesis](./prothesis)** (πρόθεσις) | 탐구 전 관점 선택지 제시 | 분석 시작 전 |
| **[Syneidesis](./syneidesis)** (συνείδησις) | 결정 지점에서 잠재적 갭 표면화 | 의사결정 시점 |
| **[Hermeneia](./hermeneia)** (ἑρμηνεία) | 의도-표현 갭을 대화로 명확화 | 실행 전 |
| **[Katalepsis](./katalepsis)** (κατάληψις) | AI 작업에 대한 확실한 이해 달성 | AI 작업 완료 후 |

## 핵심 아이디어

각 프로토콜은 고유한 인지적 결핍을 해소합니다:

```
Protocol = (Deficit, Initiator, Operation, Operand) → Resolution
```

| 프로토콜 | 결핍 | 개시자 | 연산 | 타입 시그니처 |
|----------|------|--------|------|---------------|
| **Prothesis** | FrameworkAbsent | AI-detected | SELECT | `FrameworkAbsent → FramedInquiry` |
| **Syneidesis** | GapUnnoticed | AI-detected | SURFACE | `GapUnnoticed → AuditedDecision` |
| **Hermeneia** | IntentMisarticulated | User-initiated | EXTRACT | `IntentMisarticulated → ClarifiedIntent` |
| **Katalepsis** | ResultUngrasped | User-initiated | VERIFY | `ResultUngrasped → VerifiedUnderstanding` |

<img src="./assets/epistemic-matrix-ko.svg" alt="인식론적 타입 변환" width="560">

- **Prothesis**: "어떤 렌즈로?" → AI가 선택지 제시, 사용자가 선택 (`FrameworkAbsent → FramedInquiry`)
- **Syneidesis**: "뭘 놓쳤지?" → AI가 갭을 질문으로 표면화, 사용자가 판단 (`GapUnnoticed → AuditedDecision`)
- **Hermeneia**: "내가 뭘 말하려는 거지?" → AI가 해석 선택지 제시, 사용자가 의도 인식 (`IntentMisarticulated → ClarifiedIntent`)
- **Katalepsis**: "뭘 한 거야?" → AI가 질문으로 사용자의 이해를 검증 (`ResultUngrasped → VerifiedUnderstanding`)

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
```

## 사용법

```
/prothesis [질문]    # 분석 전 관점 선택지 제시
/syneidesis [작업]   # 실행 중 갭 표면화 활성화
/hermeneia [표현]    # 모호한 의도 명확화
/katalepsis          # AI 작업에 대한 이해 검증
```

## 라이선스

MIT
