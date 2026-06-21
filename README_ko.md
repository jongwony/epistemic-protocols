# Epistemic Protocols

> [English](./README.md)

AI 협업이 방향을 잘못 잡으면, 전부 다시 합니다. 이 프로토콜은 어긋남을 일찍 잡습니다 — 특히 계획 단계에서, 그리고 그것이 코드나 다른 후속 작업으로 굳어지기 전에. 구현이 커지기 전에 방향부터 바로잡으세요.

## 왜 필요한가

잘못된 방향을 계획 단계에서 고치면 대화 한 턴이면 될 수 있습니다.
그 어긋남이 코드, 배포 단계, 후속 설명으로 굳어지면 몇 시간의 재작업이 될 수 있습니다.
이 프로토콜은 의도, 목표, 맥락, 관점, 실행, 적용성, 회상, 이해 같은 결정 지점에 구조화된 체크포인트를 삽입해, 어긋남을 커지기 전에 드러내고 판단하고 조정하게 합니다.

## 미션과 구조 (Mission and Machinery)

**명시된 미션 (Stated Mission)** — 공개 진입점: 잘못된 방향을 일찍, 특히 계획 단계에서 잡는 것. 가장 명확한 진입 스토리이며 대부분의 사용자가 프로토콜에 이르는 경로입니다.

**실제 구조 (Realized Machinery)** — 실제 커버리지: 구조화된 체크포인트가 계획, 분석, 결정, 실행, 검증, 회상, 이해에 걸쳐 작동합니다. Prosoche(실행 가드레일 컴파일), Epharmoge(사후 적용성), Anamnesis(세션 회상), Katalepsis(이해 검증) 같은 프로토콜은 계획 단계 너머까지 확장됩니다.

두 층은 다른 청중을 대상으로 합니다: README와 랜딩 카피는 좁은 공개 계약을 운반하고, `SKILL.md`와 `CLAUDE.md`는 전체 구조를 서술합니다. 두 층을 정합하게 유지하는 거버넌스 규칙은 [docs/mission-bridge.md](./docs/mission-bridge.md)를 참조하세요.

## 빠른 시작

### Claude Code

모든 프로토콜과 유틸리티를 설치합니다:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install.sh | bash
```

`/onboard`를 실행하세요 — 최근 세션 기반으로 빠른 추천을 받고, 원하면 시나리오, 실행, 퀴즈를 통한 가이드 학습으로 이어갑니다.

### Codex

이 레포지토리는 Codex 플러그인 marketplace이기도 합니다. GitHub에서 추가하려면:

```bash
curl -fsSL https://raw.githubusercontent.com/jongwony/epistemic-protocols/main/scripts/install-codex.sh | bash
```

로컬 checkout으로 개발 중이라면:

```bash
codex plugin marketplace add /path/to/epistemic-protocols
```

Codex marketplace는 Claude Code와 같은 플러그인 경계를 유지합니다: 각 프로토콜은 독립 플러그인이고, `epistemic-cooperative`가 유틸리티 스킬을 담습니다. 빠른 추천은 `onboard`부터 시작하고, 프로토콜 변경을 개발 중이라면 로컬 checkout을 추가하세요.

<details>
<summary>참고</summary>

- Codex marketplace는 [`.agents/plugins/marketplace.json`](./.agents/plugins/marketplace.json)에 있습니다.
- 각 플러그인은 기존 Claude manifest 옆에 Codex manifest를 둡니다: `<plugin>/.codex-plugin/plugin.json`.
- marketplace에는 15개 프로토콜 플러그인과 `epistemic-cooperative`가 포함됩니다.

</details>

### 기타 에이전트 도구

프로토콜 스킬 원본은 각 플러그인 디렉터리의 `<plugin>/skills/<name>/SKILL.md`에 있습니다. 이 레포지토리는 더 이상 `.agents/skills/` 심링크 뷰를 미리 싣지 않습니다. Codex marketplace discovery가 플러그인 manifest와 Agent Skills 심링크를 함께 스캔하면 같은 스킬이 중복 노출될 수 있기 때문입니다.

[Agent Skills](https://agentskills.io/specification) 스타일 뷰가 필요한 호스트는 Codex marketplace checkout 바깥에서 별도로 materialize하거나, 호스트별 패키징을 사용하세요. 런타임 *tool grounding*은 여전히 도구마다 다를 수 있어, Claude Code 외 호스트에서의 프로토콜 동작은 cross-host 사용 증거가 누적될 때까지 잠정적인 것으로 다루세요.

## 프로토콜

| 프로토콜 | 명령어 | 사용 시점 |
|----------|--------|----------|
| [Aitesis](./aitesis) | `/inquire` | AI가 필요한 걸 묻지 않고 바로 실행할 때 |
| [Euporia](./euporia) | `/elicit` | 의도가 있으나 결과가 명확하지 않아서 귀납적으로 표면화해야 할 때 |
| [Prothesis](./prothesis) | `/frame` | 여러 관점이 필요한데 어떤 것이 맞는지 모를 때 |
| [Analogia](./analogia) | `/ground` | AI 추천이 이론적으론 맞는데 내 상황에 맞는지 모를 때 |
| [Periagoge](./periagoge) | `/induce` | 구체적 사례들이 쌓여 어떤 본질로 수렴하는데 추상화가 아직 자리잡지 않았을 때 |
| [Syneidesis](./syneidesis) | `/gap` | 실행하려는데 뭔가 빠뜨린 것 같을 때 |
| [Prosoche](./prosoche) | `/attend` | 자율 실행에 작업을 넘기기 직전 — 경계를 검증 가능한 goal 조건으로 먼저 컴파일할 때 |
| [Epharmoge](./epharmoge) | `/contextualize` | AI 결과가 정확하지만 내 상황에 안 맞을 때 |
| [Elenchus](./elenchus) | `/sublate` | working context를 외부화하기 직전, 변증법적으로 검증이 필요할 때 |
| [Horismos](./horismos) | `/bound` | 내가 아는 것과 AI가 판단할 것의 경계를 정해야 할 때 |
| [Anamnesis](./anamnesis) | `/recollect` | 이전에 논의했던 무언가가 막연히 기억나지만 구체적으로 짚어낼 수 없을 때 |
| [Anagoge](./anagoge) | `/ascend` | 여러 세션에 걸친 작업 라인·토픽·개념 전체가 막연히 기억나지만 어느 한 세션이 아닐 때 |
| [Diylisis](./diylisis) | `/distill` | 작업 맥락을, 그것을 전혀 공유하지 않는 새 세션에 넘길 때 — 세션-결박된 참조를 먼저 증류해 낼 때 |
| [Katalepsis](./katalepsis) | `/grasp` | AI가 큰 변경을 했고 이해, 승인, 설명, 수정으로 빠르게 진입해야 할 때 |
| [Hyphegesis](./hyphegesis) | `/conduct` | 여러 인지 이동의 순서·독립성·화해·종료·라우팅이 자명하지 않을 때 — 작업을 시작하기 전에 세션 전체를 어떻게 수행할지 지휘 |

관심사 클러스터: Planning (`/inquire`, `/elicit`) · Analysis (`/frame`, `/ground`, `/induce`) · Decision (`/gap`) · Execution (`/attend`) · Verification (`/contextualize`, `/sublate`) · Cross-cutting (`/bound`, `/recollect`, `/ascend`, `/distill`, `/grasp`, `/conduct`)

## 유틸리티

| 플러그인 | 명령어 | 용도 |
|----------|--------|------|
| [Epistemic Cooperative](./epistemic-cooperative) | `/onboard`, `/probe`, `/catalog`, `/report`, `/dashboard`, `/write`, `/steer`, `/realign`, `/misuse`, `/triage`, `/dispatch`, `/forge`, `/reduced-space-test` | 프로토콜 학습, 결핍 인식 fit review, 핸드북 레퍼런스, 사용 분석, 커버리지 대시보드, 멀티 관점 블로그 작성, 프로젝트 프로필 재조정, 프로젝트 가이드 direction line 지평융합, 소급적 계약 위반 감지, work-unit triage, PR fanout + 기각 트레이스 inscription 기반 focused work-unit dispatch, 레퍼런스-grounded prompt-artifact 형성, 그리고 scoped 실증 검증 |

**세 가지 발견 모드 공존** (서로 대체하지 않음):

- `/catalog` — 패시브 레퍼런스 핸드북 (브라우징 / 룩업; 이미 질문을 알고 있을 때)
- `/onboard` — 패턴 기반 추천 + 선택적 trial (세션 히스토리 기반; 자신의 패턴에 맞는 프로토콜을 학습하고 싶을 때)
- `/probe` — AI 가설 기반 결핍 인식 (어떤 결핍이 맞는지 아직 명명하지 못할 때 multi-hypothesis fit review)

**소급적 감사** (위 발견 트리오와 별도 카테고리):

- `/misuse` — 소급적 계약 위반 스캔 (과거 `/ground`·`/induce` 프로토콜 계약 위반을 감지; 사용자 구성 리뷰를 위한 위반 레코드 제시)

**프로젝트 가이드 direction-line 융합** (3-horizon Horizontverschmelzung):

- `/realign` — 세 horizon(프로젝트 가이드 현 inscribed direction line · 설정된 channel set 으로부터의 외부 direction signals · 별도 sub-step 으로 elicit 되는 사용자의 현 pre-understanding)을 surface, 각 horizon 의 보존 / 변환 / 탈락을 표시한 per-horizon trace 와 함께 fusion candidate 를 합성, `/induce` 의 widen / narrow / fuse / reorient / confirm / dismiss 어휘로 dialectical shaping, 사용자 confirm 시 fused line 을 프로젝트 가이드 direction line 으로 write (rollback 은 프로젝트 버전관리)

**Work-unit triage 와 dispatch**:

- `/triage` — scoped GitHub `RawIssueSet`을 읽고, 관련 이슈를 묶고, 각 그룹을 problem frame으로 normalize한 뒤, 현재 세션에서 `AGENTS.md` northstar와 융합해 route choice가 포함된 dispatchable initial prompt를 emit
- `/dispatch` — focused work unit 또는 initial prompt를 입력으로 받아 실행 topology 계약을 설정(`/bound` compose), 각 unit의 premise를 검증하고, work-unit branch/PR로 fanout한 뒤, review feedback을 로드하고 기각 트레이스를 linked issue에 inscribe

**레퍼런스-grounded prompt 형성**:

- `/forge` — 대상 레퍼런스(벤더 모델 prompt guide, Codex Goals 스펙)를 읽고, 사용자의 미명세 의도를 modality-aware IR로 역귀납한 뒤, canonical-external 동적 fetch + staleness guard로 레퍼런스에 grounding하고, 후속 세션/도구용 prompt artifact(후속 세션/도구용 initial prompt, 또는 상주 custom-skill recipe)를 projection; 벤더-무관 core + 인자화 adapter seam(Higgsfield, gpt-image, codex-goals, claude-session, dia), 교차-adapter 추상은 의도적으로 유예된 colimit

**Scoped 실증 검증**:

- `/reduced-space-test` — target↔surrogate 등가 주장을 검증 가능한 facet으로 분해하고, residual 여집합과 함께 사용자-동기화된 대리 테스트 공간을 bound(`/bound` compose)한 뒤, 그 안에서 증거를 포착(`/inquire` compose)하고, 미커버 여집합을 후속으로 carry; 절대 등가를 주장하는 대신 결과 주장을 테스트된 조건으로 scoping하는 오케스트레이션 유틸리티로, 새 프로토콜이나 graph node를 추가하지 않음

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
| Prosoche | προσοχή | 주의 집중 |
| Epharmoge | ἐφαρμογή | 적용, 맞춤 |
| Elenchus | ἔλεγχος | 반박, 교차 심문 |
| Anamnesis | ἀνάμνησις | 상기, 회상 |
| Anagoge | ἀναγωγή | 끌어올림 |
| Diylisis | διύλισις | 정제, 증류 |
| Hyphegesis | ὑφήγησις | 앞서 이끌기, 안내 |

</details>

## 감사의 말

- [@yolohyo](https://github.com/yolohyo) — Comment-review 코멘트 라이프사이클 UX 설계 기여
- [@zzsza](https://github.com/zzsza) — Onboard 퀴즈 기반 참여형 UX 설계 기여

## 라이선스

MIT
