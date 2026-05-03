# Epistemic Protocols

> [English](./README.md)

AI 협업이 방향을 잘못 잡으면, 전부 다시 합니다. 이 프로토콜은 어긋남을 일찍 잡습니다 — 특히 계획 단계에서, 그리고 그것이 코드나 다른 후속 작업으로 굳어지기 전에. 구현이 커지기 전에 방향부터 바로잡으세요.

## 왜 필요한가

잘못된 방향을 계획 단계에서 고치면 대화 한 턴이면 될 수 있습니다.
그 어긋남이 코드, 배포 단계, 후속 설명으로 굳어지면 몇 시간의 재작업이 될 수 있습니다.
이 프로토콜은 의도, 목표, 맥락, 관점, 실행, 적용성, 회상, 이해 같은 결정 지점에 구조화된 체크포인트를 삽입해, 어긋남을 커지기 전에 드러내고 판단하고 조정하게 합니다.

## 미션과 구조 (Mission and Machinery)

**명시된 미션 (Stated Mission)** — 공개 진입점: 잘못된 방향을 일찍, 특히 계획 단계에서 잡는 것. 가장 명확한 진입 스토리이며 대부분의 사용자가 프로토콜에 이르는 경로입니다.

**실제 구조 (Realized Machinery)** — 실제 커버리지: 구조화된 체크포인트가 계획, 분석, 결정, 실행, 검증, 회상, 이해에 걸쳐 작동합니다. Prosoche(실행 리스크), Epharmoge(사후 적용성), Anamnesis(세션 회상), Katalepsis(이해 검증) 같은 프로토콜은 계획 단계 너머까지 확장됩니다.

두 층은 다른 청중을 대상으로 합니다: README와 랜딩 카피는 좁은 공개 계약을 운반하고, `SKILL.md`와 `CLAUDE.md`는 전체 구조를 서술합니다. 두 층을 정합하게 유지하는 거버넌스 규칙은 [docs/mission-bridge.md](./docs/mission-bridge.md)를 참조하세요.

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
- periagoge/skills/induce
- prosoche/skills/attend
- epharmoge/skills/contextualize
- anamnesis/skills/recollect
- epistemic-cooperative/skills/onboard
```

재시작 후 `$onboard`부터 시작하세요.

<details>
<summary>참고</summary>

- 12개 프로토콜 + `onboard`를 설치합니다. `/report`, `/dashboard`, `/write`는 미포함.
- 하나만 설치하려면 같은 `skill-installer` 패턴에 단일 path만 넣으세요.
- Codex 지원 설치 세트의 소스 오브 트루스는 이 README입니다.

</details>

### 기타 에이전트 도구 (Agent Skills 표준)

Cursor, GitHub Copilot, Devin, OpenCode, Codex CLI, Gemini CLI 등은 [Agent Skills 스펙](https://agentskills.io/specification)에 따라 `.agents/skills/<name>/SKILL.md` 경로에서 스킬을 탐색합니다. 이 레포지토리는 모든 프로토콜/유틸리티 스킬을 해당 경로에 미리 노출해 둡니다(플러그인 원본을 가리키는 상대 심링크 — 파일 중복 없음). 레포를 클론하면 자동 인식되며, 별도 인스톨러 단계는 필요 없습니다.

스킬 추가/이름 변경 후 재생성:

```bash
scripts/sync-agents-symlinks.sh
```

`agents-symlinks-sync` 정적 검사가 pre-commit 단계에서 머터리얼라이즈된 뷰와 플러그인 원본 사이의 드리프트를 차단합니다.

> 참고: `.agents/skills/`를 통한 스킬 *디스커버리*는 검증된 cross-tool 표준입니다. 다만 `PHASE TRANSITIONS` / `TOOL GROUNDING`에서 참조하는 호스트별 런타임 도구(`Skill()`, `Task`, `AskUserQuestion` 등)는 도구마다 다를 수 있어, Claude Code 외 호스트에서의 프로토콜 동작은 Stage 2 사용 증거 누적 전까지 Stage 1 추정으로 다루세요.

## 프로토콜

| 프로토콜 | 명령어 | 사용 시점 |
|----------|--------|----------|
| [Hermeneia](./hermeneia) | `/clarify` | AI가 요청하지 않은 것을 계속 만들 때 |
| [Telos](./telos) | `/goal` | 뭔가 원하는데 성공 기준을 못 정할 때 |
| [Aitesis](./aitesis) | `/inquire` | AI가 필요한 걸 묻지 않고 바로 실행할 때 |
| [Prothesis](./prothesis) | `/frame` | 여러 관점이 필요한데 어떤 것이 맞는지 모를 때 |
| [Analogia](./analogia) | `/ground` | AI 추천이 이론적으론 맞는데 내 상황에 맞는지 모를 때 |
| [Periagoge](./periagoge) | `/induce` | 구체적 사례들이 쌓여 어떤 본질로 수렴하는데 추상화가 아직 자리잡지 않았을 때 |
| [Syneidesis](./syneidesis) | `/gap` | 실행하려는데 뭔가 빠뜨린 것 같을 때 |
| [Prosoche](./prosoche) | `/attend` | 실행 준비 상태 확인과 위험한 행동 게이팅이 필요할 때 |
| [Epharmoge](./epharmoge) | `/contextualize` | AI 결과가 정확하지만 내 상황에 안 맞을 때 |
| [Horismos](./horismos) | `/bound` | 내가 아는 것과 AI가 판단할 것의 경계를 정해야 할 때 |
| [Anamnesis](./anamnesis) | `/recollect` | 이전에 논의했던 무언가가 막연히 기억나지만 구체적으로 짚어낼 수 없을 때 |
| [Katalepsis](./katalepsis) | `/grasp` | AI가 큰 변경을 했는데 실제로 이해가 필요할 때 |

관심사 클러스터: Planning (`/clarify`, `/goal`, `/inquire`) · Analysis (`/frame`, `/ground`, `/induce`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`)

## 유틸리티

| 플러그인 | 명령어 | 용도 |
|----------|--------|------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/probe`, `/catalog`, `/report`, `/dashboard`, `/write`, `/steer`, `/misuse`, `/crystallize`, `/rehydrate` | 프로토콜 학습, 결핍 인식 fit review, 핸드북 레퍼런스, 사용 분석, 커버리지 대시보드, 멀티 관점 블로그 작성, 세션 calibration drift audit 기반 프로젝트 프로필 재조정, 소급적 계약 위반 감지, 그리고 cross-session 연속성을 위한 Horizon-Fusion Text(HFT) 쓰기/읽기 쌍 |

**세 가지 발견 모드 공존** (서로 대체하지 않음):

- `/catalog` — 패시브 레퍼런스 핸드북 (브라우징 / 룩업; 이미 질문을 알고 있을 때)
- `/onboard` — 패턴 기반 추천 + 선택적 trial (세션 히스토리 기반; 자신의 패턴에 맞는 프로토콜을 학습하고 싶을 때)
- `/probe` — AI 가설 기반 결핍 인식 (어떤 결핍이 맞는지 아직 명명하지 못할 때 multi-hypothesis fit review)

**소급적 감사** (위 발견 트리오와 별도 카테고리):

- `/misuse` — 소급적 계약 위반 스캔 (과거 `/ground`·`/induce` 프로토콜 계약 위반을 감지; 사용자 구성 리뷰를 위한 위반 레코드 제시)

**Cross-session 연속성** (HFT write/read 쌍):

- `/crystallize` — 세션의 지평융합 잔여를 4-layer Markdown 파일(표면 텍스트 · Wirkungsgeschichte · Reference Shells · Excluded)로 inscribe; stage 전환 시점 또는 세션 boundary 직전에 호출
- `/rehydrate` — 기존에 inscribe된 HFT를 진입하여 originating 세션의 Vorverständnis로 현 세션을 prime; auxiliary substrate(auto-memory · hypomnesis)는 `/inquire` 또는 `/recollect` 명시 호출로만 접근 가능

## 설계

각 프로토콜은 인간-AI 협업이 어긋날 수 있는 특정 결정 지점을 다룹니다. 공개 문서는 계획 단계의 진입 훅을 앞세우고, 컨트리뷰터 문서는 계획/실행/검증/회상/이해까지 포괄하는 더 넓은 구조를 설명합니다. 두 층을 잇는 설명은 [docs/mission-bridge.md](./docs/mission-bridge.md), 아키텍처와 설계 철학의 상세 내용은 [CLAUDE.md](./CLAUDE.md)를 참조하세요.

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
| Periagoge | περιαγωγή | 돌려세움, 방향 전환 |
| Prosoche | προσοχή | 주의 집중 |
| Epharmoge | ἐφαρμογή | 적용, 맞춤 |
| Anamnesis | ἀνάμνησις | 상기, 회상 |

</details>

## 감사의 말

- [@yolohyo](https://github.com/yolohyo) — Artifact-review 코멘트 라이프사이클 UX 설계 기여
- [@zzsza](https://github.com/zzsza) — Onboard 퀴즈 기반 참여형 UX 설계 기여

## 라이선스

MIT
