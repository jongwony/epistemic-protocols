# /fit — Harmoge (ἁρμογή)

> [English](./README.md)

<a name="harmoge--fit-ἁρμογή"></a>
<a name="harmoge란"></a>
<a name="핵심-문제"></a>
무엇을 원하는지는 알고 있고 방향·설계·구현도 이미 눈앞에 있거나 곧 만들어질 참인데, 일반적인 설명만으로는 어디서부터 내 의도와 어긋나는지 보이지 않을 때가 있습니다. 규칙으로 적힌 문장은 멀쩡해 보이다가도 도저히 받아들이기 어려운 방식으로 처리되는 메시지 하나가 들어와야 빈틈이 드러나고, 한 조항에 대한 두 가지 해석도 둘 다 그럴듯해 보이다가 구체적인 사건 하나가 그 사이에 놓여야 비로소 갈립니다. 설계나 구현의 경계를 구체적인 사례를 봐야만 확인할 수 있을 때 `/fit`을 씁니다.

## 시작하는 법

<a name="사용법"></a>
<a name="해법"></a>
```
/fit [대상 — 방향, 설계, 또는 구현 — 과 그것이 무엇을 위한 것인지]
```

AI가 구체적인 사례를 들어 여러분을 인터뷰합니다. 먼저 대상과 관련된 자료를 읽고 지금까지 살펴본 안과 남은 선택지 — 현재 가장 잘 맞는 안, 갈리는 대안과 타협점, 아직 열려 있는 경계 — 를 보여 준 뒤, 결과가 가장 크게 달라지는 구체적인 사례부터 본문을 직접 보여 주며 판정을 묻습니다.

답은 여러분의 말로 편하게 하면 됩니다. 필수, 허용, 금지, "모르겠다"는 물론이고, 직접 이유나 새 예시를 들어도 됩니다. 매 라운드마다 AI는 지난 답에서 읽은 내용(어느 턴이나 도구 결과에 근거하는지 표시)과 대상에 반영한 변경을 보여 주고, 처음 호출한 뒤부터 쌓인 모든 사례를 다시 돌려 새 변경이 앞선 판정을 조용히 깨뜨리지 않았는지 확인시켜 줍니다. 글로만 적힌 설계나 방향처럼 직접 실행해 볼 수 없는 대상은 실제 관찰 결과가 아니라 AI가 대상을 읽은 결과라고 분명히 표시합니다. 언제든 그만둘 수 있으며, 그때까지 정한 내용은 대화에 남고 이미 대상에 반영한 변경은 되돌리지 않습니다.

## 실행하고 나면 무엇이 남나요

라운드에서 보여 준 지금까지 살펴본 안과 남은 선택지가 목적에 충분하다고 판단되면 이를 확정해 받습니다(이후 턴에서 판정을 고치거나 다시 받을 수도 있습니다). 만약 확정하려는 선택이 증거와 어긋나는 가정 위에 서 있거나 여러분이 밝힌 목표와 부딪치는데도 그 결과를 아직 어떤 라운드에서도 본 적이 없다면, AI는 확정을 보류한 채 그 결과를 다음 구체적인 사례로 먼저 보여 줍니다. 그 사례를 확인한 뒤 해당 타협을 감수하고 확정할지 직접 결정할 수 있습니다. 실행이 끝나면 내가 판정한 사례들, 받아들인 타협점, 아직 열려 있는 경계, 그에 맞춰 다듬어진 대상, 그리고 지금까지 모은 모든 사례에서 대상이 어떻게 동작하는지가 한눈에 남습니다.

<details>
<summary>다른 프로토콜과의 비교 및 그리스어 이름</summary>

**Harmoge**(ἁρμογή, 맞춰 이음·접합)는 설명만으로는 의도와 맞물리지 않는 해 공간(`SolutionSpaceUnfused`)을 구체적인 사례를 통해 의도와 맞물린 해 공간(`FusedSolutionSpace`)으로 바꿉니다. 최종 기록에는 확정한 사례와 받아들인 타협, 열린 경계, 사례별 대상의 동작과 함께 대안들이 기대는 전제(가정)와 적용 범위(정의역)도 함께 남습니다.

<a name="다른-프로토콜과의-차이"></a>
### 다른 프로토콜과의 차이

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Katalepsis | User-initiated | `TargetUngrasped → VerifiedUnderstanding` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Periagoge | AI-guided | `AbstractionInProcess → CrystallizedAbstraction` |
| Hypotyposis | Hybrid | `FitUnrecognized → RecognizedForm` |
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Analogia | AI-guided | `MappingUncertain → MappingAssessment` |
| **Harmoge** | **User-initiated** | **`SolutionSpaceUnfused → FusedSolutionSpace`** |

**이웃 프로토콜과 갈리는 기준**은 무엇을 무엇에 맞추느냐입니다. `/grasp`은 맞추는 방향이 반대입니다. 대상은 그대로 두고 여러분의 이해를 대상에 맞추는 반면, `/fit`은 여러분의 의도에 대상을 맞춥니다. 무엇을 원하는지가 아직 분명하지 않을 때 의도 자체를 정하려면 `/elicit`, 여러 사례가 공유하는 공통점에 이름을 붙이려면 `/induce`, 직접 만나서 알아본 한 버전으로 끝내려면 `/sketch`, 방향을 비교해 하나를 택하려면 `/preview`, 비교의 근거가 무엇을 뒷받침하는지 따지려면 `/ground`를 씁니다. **쥐고 있는 의도에 맞출 대상이 있고 그 경계가 사례로만 드러날 때는 `/fit`을 씁니다.**

</details>

<details>
<summary>파탄 조건과 근거 문헌</summary>

<a name="파탄-조건-3종"></a>
### 파탄 조건 3종

| 파탄 | 가드 |
|------|------|
| 사례 대신 추상 읽기나 권고를 물음 | 다음 질문은 본문을 보인 구체적인 사례이고, 다른 설계는 사용자가 아는 상황에서 했을 말로 보인다 |
| 사용자의 답에 대한 AI의 읽기나 달라진 결과를 사용자의 판정으로 취급 | 판정은 사용자의 턴 위에서만 서고 사용자의 뒤 턴으로만 바뀐다; 읽기마다 받치는 턴을 댄다 |
| 대상을 읽은 것을 대상이 한 일로 보고 | 대상이 사례에서 한 일은 인용된 반환이 있을 때만 관찰이다; 아니면 AI의 읽기이고, 읽기라고 말하며 돌리려면 무엇이 필요한지 댄다 |

<a name="근거-문헌"></a>
### 근거 문헌

설계가 기대는 문헌과, 이 프로토콜의 조사에서 각 출처를 확인한 강도(*verified*: 원문 확인; *mostly*: 핵심 주장 확인, 주변 세부는 종합):

- Mayer, M. 등 (2015). User Interaction Models for Disambiguation in Programming by Example (*UIST*) — *verified*. 후보 프로그램들이 서로 다른 결과를 내는 입력을 사용자의 실제 데이터에서 골라 묻습니다. 다음 사례는 답이 대상을 움직이는 사례라는 점을 정합니다.
- TiCoder — *LLM-Based Test-Driven Interactive Code Generation: User Study and Empirical Evaluation* (arXiv 2404.10100, 2024) — *verified*. 후보 코드를 실행해 물을 테스트를 고릅니다. 최고 순위 사례가 참조 구현의 전제를 어겨 아무것도 줄이지 못할 수 있고(§VIII-D), 잘못된 판정 하나가 유효한 후보 전부를 걸러 낼 수 있습니다(§VI-A). 사례는 사용자가 실제로 만날 사건이어야 하고, 답은 그 말이 닿는 데까지만 묶는다는 점을 정합니다.
- Smith, E. 등 (2015). Is the cure worse than the disease? Overfitting in automated program repair (*FSE*) — *verified*. 수리에 쓴 테스트를 통과한 패치가 따로 둔 테스트에서 실패합니다. 답은 그 사례만을 위한 예외가 아니라 대상이 해야 할 일로 반영하고, 다시 돌리기는 쌓인 사례를 덮을 뿐 새 사례는 따로 주장한다는 점을 정합니다.
- Mitchell, T. (1997). *Machine Learning*. McGraw-Hill, 2장, 버전 공간 — *mostly*. 원문에서 확인한 것은 버전 공간이 주어진 사례 모두와 일치하는 가설의 집합이라는 정의입니다. 후보 집합과 앞선 판정을 고정하면 새 판정이 집합을 넓히지 않는다는 것은 원문에서 읽은 것이 아니라 그 정의에서 따라 나옵니다. **가장 약한 연결**: "후보가 줄어든다"에서 "사람의 설계가 닫힌다"로 넘어가는 단계 — 실제 설계에서는 판단 기준 자체가 움직일 수 있으므로, 여기서 진전은 열린 질문 수가 줄어드는 것이 아니라 판정이 보존되는 것으로 읽습니다.

같은 과업에서 이 인터뷰와 단순한 경계 사례 요청을 직접 비교한 연구는 찾지 못했습니다(검색 범위: 예제 기반 프로그래밍, 반례 기반 요구사항 도출, LLM 요구사항 면담). 이 프로토콜이 단순 요청보다 무엇을 더하는지는 열린 경험적 질문입니다.

</details>

<details>
<summary>설치 및 저자</summary>

<a name="설치"></a>
### 설치

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install harmoge@epistemic-protocols
```

<a name="author"></a>
### Author

Jongwon Choi (https://github.com/jongwony)

</details>
