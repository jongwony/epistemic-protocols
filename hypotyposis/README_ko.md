# Hypotyposis — /sketch (ὑποτύπωσις)

구체적인 스케치 위에 맞지 않는 곳을 표시해 가며 하나가 알아봐질 때까지 형태를 발견 (ὑποτύπωσις: 개요 — 말로 세우기 전에 먼저 그려 보는 밑그림)

> [English](./README.md)

## Hypotyposis란?

그리스어 ὑποτύπωσις(개요, 스케치)의 현대적 재해석 — **형태를 만들어야 하는데 무엇이어야 하는지는 아직 말할 수 없고, 보면 알아볼 수는 있는 순간**을 위한 프로토콜입니다. AI가 근거와 함께 초안으로 중계한 초점 아래 구체적인 스케치를 만들고, 그 위에 남긴 표시 — 맞지 않는 곳과 유지할 곳 — 를 일급 발화로 받아, 보존된 버전을 그 표시 아래 고쳐 나가며, 사용자가 특정 버전을 어떤 목적의 형태로 알아보는 순간 멈춥니다.

### 핵심 문제

어떤 형태는 보기 전에는 명세할 수 없습니다(`FitUnrecognized`): 계획이 첫 초안에서 멈추고, 서술은 만들어지는 대신 다시 쓰이고, 실제로 원하는 것은 무언가가 눈앞에 있을 때에야 떠오릅니다. 좋은 적합에는 긍정적 서술이 없고, 각 부적합은 즉각적이며 가리킬 수 있습니다. 관측 가능한 증상: "보면 알 것 같다", 도착하지 않는 첫 초안, 네 번째 고쳐 쓰는 서술.

### 해법

**서술이 아닌 재인(Recognition over Description)**: 이번 라운드의 초점, 필요한 지각, 변형 수를 초안으로 세워 근거와 함께 중계하고; 임시 격리 안에서 스케치를 만들고; 제시한 뒤 특정 버전 위의 표시를 받되 같은 답에서 이번 라운드의 읽기를 확정하거나 되돌려 보내고; 보존된 버전을 고칩니다 — 서술하는 좌표에서 다시 생성하지 않습니다 — 그리고 사용자가 어떤 목적의 형태로 한 버전을 마무리할 때까지 반복합니다. 표시는 사용자의 말 그대로 남고, AI가 거기서 읽어 낸 것은 사용자가 확정하기 전까지 잠정입니다. 끝에서 사용자는 알아본 버전이 살 곳을 이름하고(기본값은 없습니다), 나머지는 처분이 선언된 채 해제됩니다.

### 다른 프로토콜과의 차이

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Heuresis | User-initiated | `CandidateFieldUnderexpanded → DiverseCandidateField` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| **Hypotyposis** | **Hybrid** | **`FitUnrecognized → RecognizedForm`** |

**이웃과 갈리는 기준**은 그 순간에 필요한 변환입니다: 이름 붙은 대안들의 미래를 말로는 판단할 수 없음 → `/preview` (대비하고, 방향에 커밋하고, probe는 폐기); 의도의 좌표가 이미 코드베이스·규칙·과거 세션에 있음 → `/elicit` (읽어 냄); 정확한 결과가 이미 정해진 맥락에 안 맞을 수 있음 → `/contextualize` (결과를 수리); 아이디어 장이 비어 있음 → `/ideate` (넓힘); **만들 형태가 있고, 의도는 미정이고, 보면 알아볼 수 있음 → `/sketch`** (만들고, 표시하고, 고치고, 알아본다 — 그리고 알아본 버전을 남긴다).

## 파탄 조건 3종

프로토콜의 합법성은 사슬 — 스펙 중계 → 생산 → 재인 게이트 → 배치 게이트 → 정산 — 안에 있습니다. 하나라도 위반하면 무너집니다:

| 파탄 | 가드 |
|------|------|
| 보존된 버전을 고치는 대신 좌표에서 스케치를 재생성 | Concretum Retention: 매 라운드는 브리프가 이름한 부모를 고친다 |
| 표시에 대한 AI의 해석을 사용자의 약정으로 취급 | 해석은 재인 게이트에서 사용자가 확정하기 전까지 잠정 |
| 알아본 버전을 임시 경로에 방치 | 배치 게이트에 기본값 없음; 사용자가 세션보다 오래 사는 참조를 이름한다 |

## 근거 문헌

설계가 기대는 문헌과, 1차 출처를 확인한 강도(*verified*: 원문 확인; *mostly*: 핵심 주장 확인, 주변 세부는 종합):

- Alexander, C. (1964). *Notes on the Synthesis of Form*. Harvard UP — *verified*. 좋은 적합에는 긍정적 서술이 없고, 부적합은 즉각적이며 열거 가능하다. 게이트의 답 타입을 결정 — 형태의 서술이 아니라 버전 위의 표시.
- Dorst, K. & Cross, N. (2001). Creativity in the design process: co-evolution of problem–solution. *Design Studies* 22(5) — *mostly*. 문제와 해는 함께 형성된다. 좌표가 한 번 수용되면 고정되는 것이 아니라 출처를 남긴 채 개정 가능하다는 결정.
- Tohidi, M., Buxton, W., Baecker, R. & Sellen, A. (2006). Getting the right design and the design right. *CHI 2006* — *verified*. 안을 하나만 보여주면 평가가 부풀고 비판이 억제된다. 변형 수가 기본값 1이 아니라 라운드마다 확정된다는 결정.
- Dow, S. et al. (2010). Parallel prototyping leads to better design results, more divergence, and increased self-efficacy. *ACM TOCHI* 17(4) — *verified*. 피드백 전에 만든 대안이 결과와 만드는 이의 몫을 모두 높인다. 대안이 라운드 일정에 고정되지 않고 라운드마다 초안으로 세워져 재인 게이트에서 교정된다는 결정.
- Wadinambiarachchi, S. et al. (2024). The effects of generative AI on design fixation and divergent thinking. *CHI 2024* — *verified*. 이른 구체물은 이후의 상상을 좁힌다. 무엇이든 만들기 전에 라운드 스펙을 근거와 함께 중계해 스케치를 좁힌 것이 보이게 하고, 초점과 무관한 예상 밖 표시도 받아들인다는 결정.

## 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hypotyposis@epistemic-protocols
```

## 사용법

```
/sketch [지금 만들려는 것, 그리고 이미 정해진 것이 있다면 그것]
```

Hypotyposis는 이미 정해진 것을 묶고, 첫 라운드의 초점과 변형을 근거와 함께 중계하고, 스케치를 만들어 표시를 받기 위해 제시합니다. 매 라운드 사용자는 한 버전에 표시하거나, 한 초점을 충분하다고 선언하거나, 자기가 말한 목적의 형태로 한 버전을 마무리합니다. 마무리하면 알아본 버전이 살 곳을 이름하고, 결과에는 확정된 약정, 각 표시가 무엇이 되었는지의 궤적, 열어 둔 축, 그리고 알아본 버전을 가리키는 참조가 실립니다 — 무엇을 알아봤는지의 증인이지, 무엇을 만들라는 명세가 아닙니다.

## Author

Jongwon Choi (https://github.com/jongwony)
