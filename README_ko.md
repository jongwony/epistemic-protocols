# Epistemic Protocols

> [English](./README.md)

**Unknown Unknown → Known Unknown** 변환을 위한 Claude Code 플러그인.

## 프로토콜

| 프로토콜 | 목적 | 적용 시점 |
|----------|------|----------|
| **[Prothesis](./prothesis)** (πρόθεσις) | 탐구 전 관점 선택지 제시 | 분석 시작 전 |
| **[Syneidesis](./syneidesis)** (συνείδησις) | 결정 지점에서 잠재적 갭 표면화 | 의사결정 시점 |
| **[Hermeneia](./hermeneia)** (ἑρμηνεία) | 의도-표현 갭을 대화로 명확화 | 사용자 요청 시 |
| **[Katalepsis](./katalepsis)** (κατάληψις) | AI 작업에 대한 확실한 이해 달성 | AI 작업 완료 후 |

## 핵심 아이디어

세 프로토콜 모두 핵심 변환 패턴을 공유합니다:

- **Prothesis**: "어떤 렌즈로?" → AI가 선택지 제시, 사용자가 선택 (**Unknown Unknown → Known Unknown**)
- **Syneidesis**: "뭘 놓쳤지?" → AI가 갭을 질문으로 표면화, 사용자가 판단 (**Unknown Unknown → Known Unknown**)
- **Hermeneia**: "내가 뭘 말하려는 거지?" → AI가 해석 선택지 제시, 사용자가 의도 인식 (**Known Unknown → Known Known**)
- **Katalepsis**: "뭘 한 거야?" → AI가 질문으로 사용자의 이해를 검증 (**Unknown Known → Known Known**)

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
