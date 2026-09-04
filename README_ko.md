# Epistemic Protocols

> [English](./README.md)

AI 협업이 방향을 잘못 잡으면, 전부 다시 합니다. 이 프로토콜은 어긋남을 일찍 잡습니다 — 특히 계획 단계에서, 그리고 그것이 코드나 다른 후속 작업으로 굳어지기 전에. 구현이 커지기 전에 방향부터 바로잡으세요.

## 왜 필요한가

잘못된 방향을 계획 단계에서 고치면 대화 한 턴이면 될 수 있습니다.
그 어긋남이 코드, 배포 단계, 후속 설명으로 굳어지면 몇 시간의 재작업이 될 수 있습니다.
이 프로토콜은 의도, 목표, 맥락, 관점, 실행, 적용성, 회상, 이해 같은 결정 지점에 구조화된 체크포인트를 삽입해, 어긋남을 커지기 전에 드러내고 판단하고 조정하게 합니다.

## 미션과 구조 (Mission and Machinery)

**명시된 미션 (Stated Mission)** — 공개 진입점: 잘못된 방향을 일찍, 특히 계획 단계에서 잡는 것. 가장 명확한 진입 스토리이며 대부분의 사용자가 프로토콜에 이르는 경로입니다.

**실제 구조 (Realized Machinery)** — 실제 커버리지: 구조화된 체크포인트가 계획, 분석, 결정, 실행, 검증, 회상, 이해에 걸쳐 작동합니다. Merismos(목표를 조건 붙은 실행 단위로 분배), Epharmoge(사후 적용성), Anamnesis(세션 회상), Katalepsis(이해 검증) 같은 프로토콜은 계획 단계 너머까지 확장됩니다.

두 층은 다른 청중을 대상으로 합니다: README는 좁은 공개 계약을 운반하고, `SKILL.md`와 `CLAUDE.md`는 전체 구조를 서술합니다. 두 층을 정합하게 유지하는 거버넌스 규칙은 [docs/mission-bridge.md](./docs/mission-bridge.md)를 참조하세요.

## 빠른 시작

### Claude Code

모든 프로토콜을 설치합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

그다음 지금 서 있는 결정 지점에서 프로토콜을 호출하세요 — 예를 들어 방향을 확정하기 전에 `/gap`, AI에게 작업을 넘기기 전에 `/inquire`.

유틸리티 플러그인 둘은 opt-in이라 위 한 줄은 건너뜁니다. `epistemic-cooperative`는 학습·조회(`/onboard`, `/catalog`, `/probe`)와 컨트리뷰터 도구를, `route`는 매 프롬프트 훅을 담습니다. 필요한 쪽을 따로 추가하세요:

```bash
claude plugin install epistemic-cooperative@epistemic-protocols
claude plugin install route@epistemic-protocols
```

`epistemic-cooperative`를 설치했다면 `/onboard`가 최근 세션 기반으로 빠른 추천을 주고, 원하면 시나리오·실행·퀴즈를 통한 가이드 학습으로 이어갑니다.

### Codex

이 레포지토리는 Codex 플러그인 marketplace이기도 합니다. GitHub에서 추가하려면:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex.sh | bash
```

로컬 checkout으로 개발 중이라면:

```bash
codex plugin marketplace add /path/to/epistemic-protocols
```

Codex marketplace는 Claude Code와 같은 플러그인 경계를 유지합니다: 각 프로토콜은 독립 플러그인이고, `epistemic-cooperative`가 유틸리티 스킬을 담습니다. marketplace는 [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json)에 있고, 각 플러그인은 Claude manifest 옆에 Codex manifest를 `<plugin>/.codex-plugin/plugin.json`으로 둡니다.

### 기타 에이전트 도구

프로토콜 스킬 원본은 각 플러그인 디렉터리의 `<plugin>/skills/<name>/SKILL.md`에 있습니다. 이 레포지토리는 더 이상 `.agents/skills/` 심링크 뷰를 미리 싣지 않습니다. Codex marketplace discovery가 플러그인 manifest와 Agent Skills 심링크를 함께 스캔하면 같은 스킬이 중복 노출될 수 있기 때문입니다.

[Agent Skills](https://agentskills.io/specification) 스타일 뷰가 필요한 호스트는 Codex marketplace checkout 바깥에서 별도로 materialize하거나, 호스트별 패키징을 사용하세요. 런타임 *tool grounding*은 여전히 도구마다 다를 수 있어, Claude Code 외 호스트에서의 프로토콜 동작은 cross-host 사용 증거가 누적될 때까지 잠정적인 것으로 다루세요.

## 프로토콜

| 프로토콜 | 명령어 | 사용 시점 |
|----------|--------|----------|
| [Aitesis](./aitesis) | `/inquire` | AI가 필요한 걸 묻지 않고 바로 실행할 때 |
| [Euporia](./euporia) | `/elicit` | 의도는 있지만 결정 좌표가 externalized substrate(코드베이스·규칙·과거 세션)에 암묵적으로만 존재할 때 — 역추적(reverse-trace)하여 의도를 결정화 |
| [Heuresis](./heuresis) | `/ideate` | 결정을 위한 후보군이 비어 있거나 너무 일찍 하나로 수렴했을 때 — 선택하기 전에 다양한 후보군으로 먼저 넓힐 때 |
| [Proplasma](./proplasma) | `/preview` | 결정 직전인데 방향 후보들이 말로는 판단이 안 서고 직접 봐야 알 것 같을 때 — 폐기 전제의 값싼 probe들로 먼저 대비 |
| [Prothesis](./prothesis) | `/frame` | 분석을 시작하기 전에 어떤 렌즈로 볼지 정해야 할 때 — 렌즈가 하나든 여럿이든 |
| [Analogia](./analogia) | `/ground` | AI 추천이 이론적으론 맞는데 내 상황에 맞는지 모를 때 |
| [Periagoge](./periagoge) | `/induce` | 구체적 사례가 하나 이상 쌓여 어떤 본질로 수렴하는데 추상화가 아직 자리잡지 않았을 때 |
| [Syneidesis](./syneidesis) | `/gap` | 실행하려는데 뭔가 빠뜨린 것 같을 때 |
| [Merismos](./merismos) | `/apportion` | 자율 실행에 목표를 넘기기 직전 — 한 구간에 맞는 단위로 자르고 각 단위를 먼저 닫을 때 — 컴파일되면 자기 완료 조건으로, 안 되면 기록한 수용으로, 검사가 아니라 판단이 정하는 항목이면 유보로 |
| [Epharmoge](./epharmoge) | `/contextualize` | AI 결과가 정확하지만 내 상황에 안 맞을 때 |
| [Elenchus](./elenchus) | `/sublate` | working context를 외부화하기 직전, 변증법적으로 검증이 필요할 때 |
| [Horismos](./horismos) | `/bound` | 인식론적 경계가 정의되지 않았을 때 — 방향/우선순위, 범위, 유형/개념, 또는 누가 결정할지(ownership) |
| [Anamnesis](./anamnesis) | `/recollect` | 이전에 논의했던 무언가가 막연히 기억나지만 구체적으로 짚어낼 수 없을 때 |
| [Anagoge](./anagoge) | `/ascend` | 여러 세션에 걸친 작업 라인·토픽·개념 전체가 막연히 기억나지만 어느 한 세션이 아닐 때 |
| [Katalepsis](./katalepsis) | `/grasp` | 코드·논문·큰 변경을 정말 이해해야 할 때 — 아직 못 따라가겠거나, 이해한 것 같은데 확신이 없거나 — 승인·활용 전에 이해가 진짜인지 검증 |
| [Hyphegesis](./hyphegesis) | `/conduct` | 여러 인지 이동의 순서·독립성·화해·종료·라우팅이 자명하지 않을 때 — 작업을 시작하기 전에 세션 전체를 어떻게 수행할지 지휘 |

관심사 클러스터: Planning (`/inquire`, `/elicit`, `/ideate`, `/preview`) · Analysis (`/frame`, `/ground`, `/induce`) · Decision (`/gap`) · Execution (`/apportion`) · Verification (`/contextualize`, `/sublate`) · Cross-cutting (`/bound`, `/recollect`, `/ascend`, `/grasp`, `/conduct`)

## 유틸리티

프로토콜 옆에 플러그인 둘이 있습니다. 둘 다 Claude Code 한 줄 설치에서는 opt-in이며, 전체 스킬 목록과 계약은 각 플러그인의 README가 담습니다.

| 플러그인 | 용도 | 설치 |
|----------|------|------|
| [Epistemic Cooperative](./epistemic-cooperative) | 프로토콜 위에 얹는 유틸리티 스킬: 프로토콜 학습·조회, 결핍 인식, 프로젝트 프로필 조정, work-unit triage, prompt-artifact 형성, 리뷰 루프와 프로즈 감사, Codex 위임 리서치·이미지 | `claude plugin install epistemic-cooperative@epistemic-protocols` |
| [Route](./route) | 컨텍스트 기반 프로토콜 라우팅 — 매 프롬프트 훅 지시문이 에이전트로 하여금 쌓인 컨텍스트가 드러내는 결핍에 맞는 코어 프로토콜 하나를 호출하게 함 | `claude plugin install route@epistemic-protocols` |

필요한 프로토콜을 찾는 세 가지 길, 모두 Epistemic Cooperative 안에 있습니다 (서로 대체하지 않음):

- `/catalog` — 패시브 레퍼런스 핸드북; 이미 질문을 알고 있을 때
- `/onboard` — 최근 세션 기반 추천 + 선택적 trial
- `/probe` — AI 가설 기반 결핍 인식; 뭔가 어긋났는데 어떤 결핍인지 아직 명명하지 못할 때

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
| Katalepsis | κατάληψις | 움켜잡음 (이해) |
| Horismos | ὁρισμός | 경계 짓기 |
| Aitesis | αἴτησις | 요청, 질의 |
| Analogia | ἀναλογία | 유비, 유추 |
| Periagoge | περιαγωγή | 돌려세움, 방향 전환 |
| Euporia | εὐπορία | 통로, 자원성 |
| Merismos | μερισμός | 부분으로 나눔 |
| Epharmoge | ἐφαρμογή | 적용, 맞춤 |
| Elenchus | ἔλεγχος | 반박, 교차 심문 |
| Anamnesis | ἀνάμνησις | 상기, 회상 |
| Anagoge | ἀναγωγή | 끌어올림 |
| Hyphegesis | ὑφήγησις | 앞서 이끌기, 안내 |
| Proplasma | πρόπλασμα | 예비 모형, 첫 거푸집 |
| Heuresis | εὕρεσις | 발견, 찾아냄 |

</details>

## 감사의 말

- [@yolohyo](https://github.com/yolohyo) — Comment-review 코멘트 라이프사이클 UX 설계 기여 (이 스킬은 프로토콜 합성을 걷어낸 순수 기질 플러그인으로 [cc-plugin](https://github.com/jongwony/cc-plugin)에 이관되었습니다)
- [@zzsza](https://github.com/zzsza) — Onboard 퀴즈 기반 참여형 UX 설계 기여

## 라이선스

MIT
