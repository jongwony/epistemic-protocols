# /contextualize — Epharmoge (ἐφαρμογή)
<a name="epharmoge--contextualize-ἐφαρμογή"></a>

> [English](./README.md)

## /contextualize란?

### 정의
<a name="epharmoge란"></a>

Epharmoge(ἐφαρμογή)는 적용 또는 맞춤이라는 뜻입니다. 그동안 말하고 정한 내용과 결과가 쓰이는 곳을 다시 확인해, 앞선 결정이나 규칙으로 이미 정해진 곳은 고치고 여러분만 판단할 수 있는 사항은 제안과 함께 돌려주는 프로토콜입니다. 점검 대상은 이번 세션의 산출물일 수도 있고, 다른 세션의 작업이나 문서·계획처럼 외부에서 가져온 결과물일 수도 있습니다.

### 문제
<a name="핵심-문제"></a>
<a name="사용-시기"></a>

여러 일을 오가며 집중이 분산되거나 대화가 길어질 때, 또는 다른 세션·에이전트·리뷰·머지를 거쳐 작업이 돌아왔을 때 앞서 말하고 정한 내용의 일부가 결과에서 빠지기 쉽습니다. 읽혔어야 할 규칙이 빠지거나, 이전 결정이 반영되지 않거나, 결과가 놓일 곳의 환경이나 로컬 관례와 맞지 않는 경우입니다. 결과를 만든 AI는 "끝냈다"를 "맞다"로 여기기 쉽고, 여러분도 그동안 한 말과 결과가 닿는 모든 곳을 다 떠올리기 어렵습니다. 다만 결과가 명시적인 사양 하나만 따르고 그 밖에 오간 말이 없거나, 포맷팅·오타 수정처럼 기계적인 작업이라면 `/contextualize`를 건너뛰어도 됩니다.

### 결과

한 바퀴가 돌 때마다 한 장의 정리표를 받습니다. 고친 내용과 그 근거, 여러분이 판단할 몫과 AI의 제안, 이미 잘 맞는 부분, 그리고 닿지 못한 곳이 한눈에 정리됩니다. 꼭 답해야 할 의무는 없으며 따로 "끝"을 묻지도 않습니다. 여러분의 말로든 "제안대로"로든 답을 주면, 다음 바퀴가 이를 반영하고 새 정리표를 돌려줍니다.

## 설치
<a name="설치"></a>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install epharmoge@epistemic-protocols
```

## 사용법
<a name="사용법"></a>
<a name="해결책"></a>
<a name="상태"></a>

```
/contextualize
```

결과에 닿았어야 할 내용이 빠졌거나 결과가 놓이는 곳에 맞지 않는다는 사실을 AI가 먼저 감지했을 때는, AI가 스스로 실행을 열었다고 알리며 시작하기도 합니다.

`/contextualize`를 실행하면 AI는 그동안 여러분이 한 말과 결정·목적, 결과가 따라야 할 규칙을 되찾습니다. 먼저 결과가 쓰이는 곳들을 아무것도 바꾸지 않은 채 확인하고, 닿지 못한 곳은 따로 적습니다. 앞선 결정이나 기존 규칙으로 무엇이 맞는지 이미 정해져 있는데 결과가 어긋난 곳은 AI가 결과를 고치고 변경을 다시 확인한 뒤, 무엇을 근거로 고쳤는지 알려 줍니다. 시야에서 빠졌고 지금 무엇을 뜻하는지 여러분이 직접 판단해야 하는 항목은 어디서 나온 말인지, 빠지면 어떤 영향이 있는지와 함께 구체적인 행동 선택지와 AI의 제안을 펼쳐 보입니다.

<details>
<summary>프로토콜 흐름과 불일치 신호</summary>

<a name="프로토콜-흐름"></a>
### 프로토콜 흐름

```
한 바퀴 → 결과에 닿았어야 할 것을 되찾고, 결과가 닿는 모든 곳 관측, 정해진 것을 반영하며 고칠 때마다 다시 읽음 (비표시)
한 장   → 고친 것과 그것을 정한 근거; 사용자의 몫과 구체적 행동 · AI 가 택할 행동; 맞는 것; 닿지 못한 곳
돌려줌  → 한 바퀴에 한 장 — 답은 요구되지 않고, 따로 "끝" 없음
답      → 답이 오면 다음 바퀴가 반영하고 새 한 장을 돌려준다
```

<a name="불일치-신호"></a>
### 불일치 신호

| 신호 | 탐지 |
|------|------|
| 환경 가정 | 결과가 현재 맥락에서 검증되지 않은 환경 상태를 가정 |
| 관례 불일치 | 결과가 일반적 모범 사례를 따르지만 프로젝트에 로컬 관례가 존재 |
| 범위 초과 | 결과가 관찰된 사용 사례가 요구하는 것보다 많거나 적게 다룸 |
| 시간적 맥락 | 결과가 변경되었을 수 있는 버전, 상태, 단계에 적용 |
| 빠뜨림 | 대화에서 말한 의도를 결과가 실어야 했는데 싣지 않음 |
| 결정 드리프트 | 앞서 내린 결정 — 다른 일을 길게 하기 전에, 다른 세션에서, 리뷰에서 — 을 결과가 싣지 않음 |

</details>

<details>
<summary>다른 프로토콜과의 비교</summary>

**Epharmoge**(ἐφαρμογή, 적용·맞춤)는 결과를 그것에 닿았어야 할 맥락에 다시 맞춰 탈맥락화된 실행(`ApplicationDecontextualized`)을 맥락화된 실행(`ContextualizedExecution`)으로 변환합니다. AI 주도 활성화(Layer 2)는 누락이나 불일치가 실제로 감지되었을 때만 조건부로 열립니다.

<a name="다른-프로토콜과의-차이"></a>
### 다른 프로토콜과의 차이

| 프로토콜 | 주도자 | 타입 시그니처 |
|----------|--------|---------------|
| Aitesis | AI-guided | `ContextInsufficient → SufficientContext` |
| Merismos | User-initiated | `GoalPlanUncompiled → ConditionBearingUnitPlan` |
| **Epharmoge** | **AI-guided** | **`ApplicationDecontextualized → ContextualizedExecution`** |
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |

<a name="aitesis와의-차이"></a>
### Aitesis와의 차이

| 관점 | Aitesis | Epharmoge |
|------|---------|-----------|
| 타이밍 | 결과가 있기 전 | 결과가 있은 뒤 |
| 방향 | AI가 스스로 모으고 사용자의 Unknown을 돌려줌 | AI가 결과에 닿았어야 할 것을 되찾아, 정해진 것은 고치고 사용자가 판단할 것은 돌려줌 |
| 축 | Context fitness | Context fitness |
| 결핍 | `ContextInsufficient` | `ApplicationDecontextualized` |
| 해소 | `SufficientContext` | `ContextualizedExecution` |

둘 다 맥락 적합성(context fitness)을 다루지만 타이밍과 대상이 반대입니다. Aitesis는 결과가 나오기 전에 AI에게 부족한 맥락을 묻고, Epharmoge는 결과가 나온 뒤에 오는 길에 잃은 것과 결과가 놓이는 곳에 맞는지를 묻습니다.

</details>

## 저자
<a name="저자"></a>

Jongwon Choi (https://github.com/jongwony)
