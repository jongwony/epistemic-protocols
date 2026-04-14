# Epistemic Protocols

> [English](./README.md)

AI 협업이 방향을 잘못 잡으면, 전부 다시 합니다. 이 프로토콜은 방향 오류를 일찍 잡습니다 — 코드가 아니라 계획 단계에서. 방향을 고치세요, 구현이 아니라.

## 왜 필요한가

잘못된 방향을 계획 단계에서 고치면 대화 한 턴이면 됩니다.
코드 단계에서 고치면 몇 시간의 재작업이 됩니다.
이 프로토콜은 의도, 목표, 맥락, 관점, 실행 등 결정 지점에 구조화된 체크포인트를 삽입하여, 구현에 들어가기 전에 AI와 방향을 맞춥니다.

## 빠른 시작

### Claude Code

모든 프로토콜과 유틸리티를 설치합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

`/onboard`를 실행하세요 — 최근 세션 기반으로 빠른 추천을 받고, 원하면 시나리오, 실행, 퀴즈를 통한 가이드 학습으로 이어갑니다.

### Codex

Codex에 붙여넣고 실행하세요:

```text
$skill-installer jongwony/epistemic-protocols 에서 다음 스킬들을 설치해 주세요:
- prothesis/skills/frame
- syneidesis/skills/gap
- hermeneia/skills/clarify
- katalepsis/skills/grasp
- telos/skills/goal
- aitesis/skills/inquire
- horismos/skills/bound
- analogia/skills/ground
- prosoche/skills/attend
- epharmoge/skills/contextualize
- epistemic-cooperative/skills/onboard
```

재시작 후 `$onboard`부터 시작하세요.

<details>
<summary>참고</summary>

- 10개 프로토콜 + `onboard`를 설치합니다. `/report`, `/dashboard`, `/write`는 미포함.
- 하나만 설치하려면 같은 `skill-installer` 패턴에 단일 path만 넣으세요.
- Codex 지원 설치 세트의 소스 오브 트루스는 이 README입니다.

</details>

## 프로토콜

| 프로토콜 | 명령어 | 사용 시점 |
|----------|--------|----------|
| [Hermeneia](./hermeneia) | `/clarify` | AI가 요청하지 않은 것을 계속 만들 때 |
| [Telos](./telos) | `/goal` | 뭔가 원하는데 성공 기준을 못 정할 때 |
| [Aitesis](./aitesis) | `/inquire` | AI가 필요한 걸 묻지 않고 바로 실행할 때 |
| [Prothesis](./prothesis) | `/frame` | 여러 관점이 필요한데 어떤 것이 맞는지 모를 때 |
| [Analogia](./analogia) | `/ground` | AI 추천이 이론적으론 맞는데 내 상황에 맞는지 모를 때 |
| [Syneidesis](./syneidesis) | `/gap` | 실행하려는데 뭔가 빠뜨린 것 같을 때 |
| [Prosoche](./prosoche) | `/attend` | 실행 준비 상태 확인과 위험한 행동 게이팅이 필요할 때 |
| [Epharmoge](./epharmoge) | `/contextualize` | AI 결과가 정확하지만 내 상황에 안 맞을 때 |
| [Horismos](./horismos) | `/bound` | 내가 아는 것과 AI가 판단할 것의 경계를 정해야 할 때 |
| [Anamnesis](./anamnesis) | `/recollect` | 이전에 논의했던 무언가가 막연히 기억나지만 구체적으로 짚어낼 수 없을 때 |
| [Katalepsis](./katalepsis) | `/grasp` | AI가 큰 변경을 했는데 실제로 이해가 필요할 때 |

관심사 클러스터: Planning (`/clarify`, `/goal`, `/inquire`) · Analysis (`/frame`, `/ground`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`)

## 유틸리티

| 플러그인 | 명령어 | 용도 |
|----------|--------|------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/report`, `/dashboard`, `/write` | 프로토콜 학습, 사용 분석, 커버리지 대시보드, 멀티 관점 블로그 작성 |

## 설계

각 프로토콜은 AI 협업이 잘못될 수 있는 특정 지점을 다룹니다. 아키텍처와 설계 철학에 대한 상세 내용은 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

## 컨트리뷰터를 위해

이 레포에 처음이신가요? [ONBOARDING.md](./ONBOARDING.md)부터 시작하세요. 의도된 사용 방법: 새 Claude Code 세션에 파일 전체를 붙여넣으세요 — 문서에 내장된 지시문 블록이 Claude를 온보딩 버디로 전환합니다. Claude가 환경을 셋업 체크리스트와 대조하고, 현재 상태에 가장 잘 맞는 프로토콜로 라우팅하며, 핵심 문서를 순서대로 안내하고, 컨트리뷰션 워크플로우와 컨벤션을 함께 살펴봅니다.

온보딩 진행 중에 프로토콜을 직접 경험할 수 있도록, 초반에 진입점 라우팅이 제공됩니다:

- **이 프로토콜 자체가 처음, 사전 컨텍스트 없음** → `/onboard` (epistemic-cooperative) — 빠른 추천 + 시나리오/실행/퀴즈 가이드
- **프로젝트 자체에 대한 이해를 검증하고 싶음** → `/grasp` (katalepsis) — `CLAUDE.md` 또는 특정 `SKILL.md` 대상
- **이미 나만의 Claude Code 워크플로우가 있고 이 프로젝트를 그 위에 매핑하고 싶음** → `/ground` (analogia) — 본인의 사용 패턴을 concrete domain 으로
- **어떤 프로토콜을 언제 쓰는지 빠른 레퍼런스가 필요** → `/catalog` (epistemic-cooperative)

프로토콜 자체의 아키텍처와 원칙은 [CLAUDE.md](./CLAUDE.md)와 [`.claude/rules/`](./.claude/rules/) 아래의 axiom 파일들을 참고하세요.

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
