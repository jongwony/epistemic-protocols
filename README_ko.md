# Epistemic Protocols

> [English](./README.md)

AI 협업이 방향을 잘못 잡으면, 전부 다시 합니다. 이 프로토콜은 어긋남을 일찍 잡습니다 — 특히 계획 단계에서, 그리고 그것이 코드나 다른 후속 작업으로 굳어지기 전에. 구현이 커지기 전에 방향부터 바로잡으세요.

## 왜 필요한가

잘못된 방향을 계획 단계에서 고치면 대화 한 턴이면 될 수 있습니다.
그 어긋남이 코드, 배포 단계, 후속 설명으로 굳어지면 몇 시간의 재작업이 될 수 있습니다.
이 프로토콜은 중요한 결정 지점마다 구조화된 점검 절차를 두어, 잘못된 방향 위에 후속 작업이 쌓이기 전에 사람과 AI가 함께 방향을 바로잡도록 돕습니다.

## 프로토콜이 도움이 되는 순간

계획 단계에서 잘못된 방향을 발견하고, 후속 작업으로 이어지기 전에 바로잡으세요. 같은 구조화된 점검 절차는 작업을 자율 실행에 넘길 때, 결과가 실제 상황에 맞는지 확인할 때, 이전 논의를 떠올릴 때, 무언가를 이해했는지 확인하고 그 위에 쌓아 올리기 전에도 도움이 됩니다.

## 빠른 시작

### Claude Code

모든 프로토콜을 설치합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

그다음 지금 서 있는 결정 지점에서 프로토콜을 호출하세요 — 예를 들어 AI에게 작업을 넘기기 전에 `/inquire`, 작업에서 무엇을 결정해야 할지 아직 보이지 않을 때 `/bound`.

유틸리티 플러그인은 opt-in으로, 별도로 설치합니다. `epistemic-cooperative`는 가이드 학습(`/onboard`), 결핍 인식(`/probe`), 컨트리뷰터 도구를 제공합니다. 실험 단계인 [`route`](#route)는 에이전트가 대화 맥락에 맞는 프로토콜을 호출하고 필요한 시점에 관련 협업 원칙을 찾도록 돕습니다. 필요한 플러그인을 추가하세요:

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
| [Aitesis](./aitesis) | `/inquire` | 작업에 필요한 맥락이 빠져 있거나 확인하지 않은 전제가 있어, 무엇이 아직 불확실한지 짚어야 할 때 |
| [Euporia](./euporia) | `/elicit` | 하고 싶은 것은 대략 있는데 어떤 결정들이 걸려 있는지 아직 짚지 못할 때 — 단서는 코드베이스·규칙·과거 세션 같은 내 자료에 있을 때 |
| [Heuresis](./heuresis) | `/ideate` | 후보가 아직 없거나 너무 일찍 하나로 좁혀졌을 때 — 고르기 전에 후보를 먼저 넓게 펼칠 때 |
| [Proplasma](./proplasma) | `/preview` | 여러 방향 중 하나로 정하기 직전인데 설명만으로는 판단이 안 서고 직접 봐야 알 것 같을 때 |
| [Hypotyposis](./hypotyposis) | `/sketch` | 무언가를 만들어야 하는데 어떤 모습이어야 하는지 말로는 못 하지만 보면 알아볼 수 있을 때 |
| [Analogia](./analogia) | `/ground` | 어떤 틀이나 유비를 이미 눈앞에 있는 사례에 가져다 쓰거나 추상을 그 사례들에 비춰 보는데, 그 비교가 실제로 무엇을 어디까지 뒷받침하는지 분명하지 않을 때 |
| [Periagoge](./periagoge) | `/induce` | 여러 구체적 사례가 무언가를 공유하는 것 같은데 아직 이름 붙이지 못했을 때 — 그 공통점을 붙잡을 때 |
| [Merismos](./merismos) | `/apportion` | 목표 하나를 자율 실행에 넘기기 직전 — 한 번의 실행 구간에 들어가는 단위로 자르고, 단위마다 언제 끝났는지 판단할 수 있게 할 때 |
| [Epharmoge](./epharmoge) | `/contextualize` | AI 결과가 정확하지만 내 실제 상황에 안 맞을 수 있을 때 |
| [Elenchus](./elenchus) | `/sublate` | 행동의 근거로 삼으려는 작업 맥락이 여전히 유효한지 의심스러울 때 — 낡았거나 출처가 약하거나 서로 어긋나는 부분을 행동 전에 변증법적으로 검증 |
| [Horismos](./horismos) | `/bound` | 작업에서 무엇을 결정해야 하는지, 어떤 결정은 직접 내리고 어떤 결정은 맡길지 아직 분명하지 않을 때 |
| [Anamnesis](./anamnesis) | `/recollect` | 이전에 논의했던 무언가가 막연히 기억나지만 구체적으로 짚어낼 수 없을 때 — 한 세션이든, 여러 세션에 걸친 작업 라인·토픽·개념이든 |
| [Katalepsis](./katalepsis) | `/grasp` | 코드·문서·결과처럼 눈앞에 있는 것을 정말 이해해야 할 때 — 아직 못 따라가겠거나, 이해한 것 같은데 확신이 없을 때 |
| [Hyphegesis](./hyphegesis) | `/conduct` | 여러 갈래의 사고가 필요한데 그 순서, 따로 돌릴 수 있는지, 결과를 어떻게 합칠지, 언제 멈출지, 각 결과가 어디로 갈지가 자명하지 않을 때 — 시작하기 전에 작업 방식을 정할 때 |

관심사 클러스터: Planning (`/inquire`, `/elicit`, `/ideate`, `/preview`, `/sketch`) · Analysis (`/ground`, `/induce`) · Execution (`/apportion`) · Verification (`/contextualize`, `/sublate`) · Cross-cutting (`/bound`, `/recollect`, `/grasp`, `/conduct`)

## 유틸리티

Claude Code용 유틸리티 플러그인 설치 방법은 [빠른 시작](#claude-code)을 참고하세요.

### [Epistemic Cooperative](./epistemic-cooperative)

각자의 결정 지점에서 작동하는 스킬들 — 프로토콜 주변에서, 작업 자체에서, 그리고 에이전트를 움직이는 산문 위에서.

| 명령어 | 사용 시점 |
|--------|----------|
| **프로토콜 찾기** | |
| `/onboard` | 처음 왔을 때 — 최근 세션에서 추천 하나를 받고, 원하면 시나리오·실행·퀴즈로 학습 |
| `/probe` | 뭔가 어긋났는데 어떤 결핍인지 이름 붙일 수 없을 때 — 가설 여럿을 제시하고 당신의 인식으로 라우팅 |
| **작업 빚기** | |
| `/forge` | 기억이 아니라 벤더 레퍼런스(모델 prompt guide, Codex Goals 스펙)에 grounding된 prompt나 상주 skill recipe가 필요할 때 |
| `/reduced-space-test` | 대리물이 실제 대상처럼 동작한다는 주장 — bounded 공간 안에서 검증하고 검증 안 된 나머지를 명시적으로 이월 |
| `/gate-check` | 옵션 집합이 당신에게 제시되기 직전 — 독립 advisor가 genuine / collapsed / malformed를 판정하고 인용 근거를 먼저 검증 |
| **변경 리뷰** | |
| `/review-loop` | 모든 finding이 코드베이스에 대해 검증되고 처분될 때까지 매 라운드 재리뷰하며 변경을 리뷰로 끌고 갈 때 |
| **지시문 산문 감사** | |
| `/white-bear` | 에이전트에게 하지 말 것을 말하는 산문 — 잘못된 대상을 계속 시야에 두는 금지 프레이밍과 부정 앵커링을 찾기 |
| `/zero-shot` | 원칙이면 일반화될 자리에 예시로 앵커링한 산문 — 그 자리를 찾아 명명 |
| **프로젝트 조타** | |
| `/realign` | 프로젝트 가이드의 direction line이 작업 방향과 더는 맞지 않을 때 — inscribed line, 외부 신호, 당신의 현재 이해를 융합 |
| **Codex 위임** | |
| `/goal-research` | 백그라운드 Codex 세션에서 범위를 잡고 외부 검증까지 받고 싶은 사실 리서치 질문 — 전체 trace를 되돌려 받음 |

### [Route](./route)

> **실험 단계.** 훅 구성과 주입되는 문구는 릴리스마다 바뀔 수 있고, 선택형 권고 채널은 아직 검증되지 않았습니다 — 어느 쪽이든 기대기 전에 [route/README_ko.md](./route/README_ko.md)를 확인하세요.

컨텍스트 기반 프로토콜 라우팅. 세션 시작 훅이 설치된 프로토콜의 결핍 테이블과 [premise](./premise) 색인을 컨텍스트 머리에, 컨텍스트 에포크마다 한 번 놓고, 매 프롬프트 훅이 프롬프트 옆에 짧은 지시문을 놓습니다. 쌓인 컨텍스트가 설치된 코어 프로토콜 정확히 하나가 해소하는 결핍을 보이면 에이전트가 그 프로토콜을 호출하고, 여럿이 맞으면 넛지하고, 없으면 침묵합니다. 호출된 프로토콜의 첫 게이트가 당신의 판단을 그 자리에 그대로 둡니다.

## 컨트리뷰터를 위해

[ONBOARDING.md](./ONBOARDING.md)부터 시작하세요. 새 Claude Code 세션에 파일 전체를 붙여넣으면 Claude가 온보딩 버디가 되어 환경 셋업, 핵심 문서, 컨트리뷰션 워크플로우를 안내합니다.

아키텍처는 [CLAUDE.md](./CLAUDE.md), 협업의 바탕이 되는 원칙은 [premise/](./premise/)에서 살펴보세요.

프로젝트를 소개하는 공개 문구를 고칠 때는 [Mission Bridge](./docs/mission-bridge.md)의 작성 기준을 따르세요.

<details>
<summary>Greek Codex</summary>

| 프로토콜 | 그리스어 | 의미 |
|----------|---------|------|
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
| Hyphegesis | ὑφήγησις | 앞서 이끌기, 안내 |
| Proplasma | πρόπλασμα | 예비 모형, 첫 거푸집 |
| Hypotyposis | ὑποτύπωσις | 개요, 밑그림 |
| Heuresis | εὕρεσις | 발견, 찾아냄 |

</details>

## 감사의 말

- [@yolohyo](https://github.com/yolohyo) — Comment-review 코멘트 라이프사이클 UX 설계 기여 (이 스킬은 프로토콜 합성을 걷어낸 순수 기질 플러그인으로 [cc-plugin](https://github.com/jongwony/cc-plugin)에 이관되었습니다)
- [@zzsza](https://github.com/zzsza) — Onboard 퀴즈 기반 참여형 UX 설계 기여

## 라이선스

MIT
