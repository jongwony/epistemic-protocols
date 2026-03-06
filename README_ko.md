# Epistemic Protocols

> [English](./README.md)

AI-인간 대화를 위한 Claude Code 플러그인 — 각 프로토콜은 인간-AI 상호작용의 특정 결정 지점을 구조화하여, 적시에 올바른 질문을 표면화합니다.

## 빠른 시작

1. Claude Code에서 마켓플레이스를 추가하세요:
   ```
   /plugin marketplace add jongwony/epistemic-protocols
   ```
2. [Epistemic Cooperative](./epistemic-cooperative) 플러그인을 설치하세요:
   ```
   /plugin install epistemic-cooperative@epistemic-protocols
   ```
3. `/onboard` 실행 — 세션을 분석하고 프로토콜을 추천합니다
4. 또는 아래 테이블에서 개별 프로토콜을 선택하세요

## 전체 설치

모든 프로토콜과 유틸리티를 한 번에 설치하려면:

```bash
git clone https://github.com/jongwony/epistemic-protocols && bash epistemic-protocols/install.sh
```

## 프로토콜

| 프로토콜 | 명령어 | 사용 시점 |
|----------|--------|----------|
| [Hermeneia](./hermeneia) | `/clarify` | 의도-표현 갭이 감지될 때 |
| [Telos](./telos) | `/goal` | 목표가 모호하거나 불확정적일 때 |
| [Epitrope](./epitrope) | `/calibrate` | 위임 범위가 불분명할 때 |
| [Aitesis](./aitesis) | `/inquire` | 실행 전 맥락이 부족할 때 |
| [Prothesis](./prothesis) | `/frame` | 프레임워크 부재, 다관점 분석이 필요할 때 |
| [Syneidesis](./syneidesis) | `/gap` | 의사결정 시 놓친 갭이 있을 때 |
| [Analogia](./analogia) | `/ground` | 추상 프레임워크가 내 맥락에 어떻게 대응되는지 확인해야 할 때 |
| [Prosoche](./prosoche) | `/attend` | 실행 시점 위험 평가가 필요할 때 |
| [Epharmoge](./epharmoge) | `/contextualize` | 실행 후 맥락 불일치가 의심될 때 |
| [Katalepsis](./katalepsis) | `/grasp` | AI 결과를 이해하지 못했을 때 |

순서는 인식론적 워크플로우를 따릅니다: Clarify → Goal → Calibrate → Inquire → Frame → Ground → Gap → Attend → Contextualize → Grasp

## 유틸리티

| 플러그인 | 명령어 | 용도 |
|----------|--------|------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/dashboard` | 세션 분석 및 프로토콜 추천 |
| [Reflexion](./reflexion) | `/reflect` | 크로스 세션 학습 |
| [Write](./write) | `/write` | 다관점 블로그 작성 |

## 설계

각 프로토콜은 AI-인간 상호작용 중 특정 인지적 결핍을 해소합니다. 아키텍처와 설계 철학에 대한 상세 내용은 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

<details>
<summary>Greek Codex</summary>

| 프로토콜 | 그리스어 | 의미 |
|----------|---------|------|
| Prothesis | πρόθεσις | 앞에 놓음 (제시) |
| Syneidesis | συνείδησις | 함께 앎 (공동 인식) |
| Hermeneia | ἑρμηνεία | 해석 |
| Katalepsis | κατάληψις | 움켜잡음 (이해) |
| Telos | τέλος | 끝, 목적 |
| Aitesis | αἴτησις | 요청, 질의 |
| Epitrope | ἐπιτροπή | 위탁, 위임 |
| Analogia | ἀναλογία | 비례, 유비 |
| Prosoche | προσοχή | 주의 집중 |
| Epharmoge | ἐφαρμογή | 적용, 맞춤 |

</details>

## 라이선스

MIT
