# Epistemic Protocols

> [English](./README.md)

AI 협업이 방향을 잘못 잡으면, 전부 다시 합니다. 이 프로토콜은 방향 오류를 일찍 잡습니다 — 코드가 아니라 계획 단계에서. 방향을 고치세요, 구현이 아니라.

## 왜 필요한가

잘못된 방향을 계획 단계에서 고치면 대화 한 턴이면 됩니다.
코드 단계에서 고치면 몇 시간의 재작업이 됩니다.
이 프로토콜은 의도, 목표, 맥락, 관점, 실행 등 결정 지점에 구조화된 체크포인트를 삽입하여, 구현에 들어가기 전에 AI와 방향을 맞춥니다.

## 빠른 시작

모든 프로토콜과 유틸리티를 설치합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

`/onboard`를 실행하세요 — 체험을 통해 프로토콜을 학습합니다: 과거 세션 기반 시나리오, 실제 프로토콜 실행, 소크라테스식 퀴즈.

개별 플러그인 설치는 각 프로토콜의 README를 참조하세요.

## 프로토콜

| 프로토콜 | 명령어 | 사용 시점 |
|----------|--------|----------|
| [Hermeneia](./hermeneia) | `/clarify` | AI가 요청하지 않은 것을 계속 만들 때 |
| [Telos](./telos) | `/goal` | 뭔가 원하는데 성공 기준을 못 정할 때 |
| [Aitesis](./aitesis) | `/inquire` | AI가 필요한 걸 묻지 않고 바로 실행할 때 |
| [Prothesis](./prothesis) | `/frame` | 여러 관점이 필요한데 어떤 것이 맞는지 모를 때 |
| [Analogia](./analogia) | `/ground` | AI 추천이 이론적으론 맞는데 내 상황에 맞는지 모를 때 |
| [Syneidesis](./syneidesis) | `/gap` | 실행하려는데 뭔가 빠뜨린 것 같을 때 |
| [Prosoche](./prosoche) | `/attend` | 작업 실행 중 위험한 행동만 사용자 판단을 거치고 싶을 때 |
| [Epharmoge](./epharmoge) | `/contextualize` | AI 결과가 정확하지만 내 상황에 안 맞을 때 |
| [Horismos](./horismos) | `/bound` | 내가 아는 것과 AI가 판단할 것의 경계를 정해야 할 때 |
| [Katalepsis](./katalepsis) | `/grasp` | AI가 큰 변경을 했는데 실제로 이해가 필요할 때 |

관심사 클러스터: Planning (`/clarify`, `/goal`, `/inquire`) · Analysis (`/frame`, `/ground`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/grasp`)

## 유틸리티

| 플러그인 | 명령어 | 용도 |
|----------|--------|------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/report`, `/dashboard` | 프로토콜 학습, 사용 분석, 커버리지 대시보드 |

## 설계

각 프로토콜은 AI 협업이 잘못될 수 있는 특정 지점을 다룹니다. 아키텍처와 설계 철학에 대한 상세 내용은 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

<details>
<summary>Greek Codex</summary>

| 프로토콜 | 그리스어 | 의미 |
|----------|---------|------|
| Prothesis | πρόθεσις | 앞에 놓음 (제시) |
| Syneidesis | συνείδησις | 함께 앎 (공동 인식) |
| Hermeneia | ἑρμηνεία | 해석 |
| Katalepsis | κατάληψις | 움켜잡음 (이해) |
| Telos | τέλος | 끝, 목적 |
| Horismos | ὁρισμός | 경계 짓기 |
| Aitesis | αἴτησις | 요청, 질의 |
| Analogia | ἀναλογία | 유비, 유추 |
| Prosoche | προσοχή | 주의 집중 |
| Epharmoge | ἐφαρμογή | 적용, 맞춤 |

</details>

## 감사의 말

- [@zzsza](https://github.com/zzsza) — Onboard 퀴즈 기반 참여형 UX 설계 기여

## 라이선스

MIT
