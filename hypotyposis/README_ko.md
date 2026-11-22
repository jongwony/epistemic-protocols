# /sketch — Hypotyposis (ὑποτύπωσις)
<a name="hypotyposis--sketch-ὑποτύπωσις"></a>

> [English](./README.md)

## /sketch란?

### 정의
<a name="hypotyposis란"></a>

Hypotyposis(ὑποτύπωσις)는 말로 다 세우기 전에 먼저 그려 보는 개요 또는 밑그림이라는 뜻입니다. 판단하려는 성질을 직접 확인할 수 있는 매체로 구체적인 버전을 만들고, 그에 대한 여러분의 반응을 받아 새 버전으로 고쳐 나가면서 목적에 맞는 형태를 알아볼 수 있게 하는 프로토콜입니다.

### 문제
<a name="핵심-문제"></a>

무언가를 만들어야 하는데 어떤 모습이어야 할지 미리 말로 설명하기는 어렵고, 막상 눈으로 보면 바로 알아볼 수 있을 때가 있습니다. 처음부터 말로 다 적어 보려 하면 첫 초안조차 나오지 못하거나, 설명만 네 번씩 고쳐 쓰게 됩니다. 실제로 원하는 모습은 눈앞에 구체적인 결과물이 놓여야 비로소 떠오르기 때문입니다. 정답을 백지에서 말로 적는 것보다 실제 초안을 보며 어색한 곳을 짚어내는 편이 훨씬 쉬울 때 `/sketch`를 씁니다.

### 결과

직접 확인한 버전 하나를 가리켜 "내 목적에는 이 형태가 맞다"고 받아들이면 그 버전이 놓일 자리를 확인하며 실행이 끝납니다. 지나친 다른 버전들도 달리 지시하지 않는 한 원래 자리에 그대로 남습니다. 선택한 버전과 함께 모든 버전의 위치, 각 버전에 요청했으나 아직 이뤄지지 않은 작업과 그 이유, 여러분의 말로 정한 내용과 AI의 제안 중 받아들인 내용, 무엇을 어떤 참조 기준에 대어 확인했는지, 매체의 한계로 보이지 않아 열린 채로 남은 성질, 그리고 AI가 제기한 이의와 그에 대한 여러분의 답이 기록으로 남습니다.

## 설치
<a name="설치"></a>

```
claude plugin marketplace add https://github.com/jongwony/epistemic-protocols
claude plugin install hypotyposis@epistemic-protocols
```

## 사용법
<a name="사용법"></a>
<a name="해법"></a>

```
/sketch [지금 만들려는 것, 그리고 이미 정해진 것이 있다면 그것]
```

무엇이든 만들기 전에 AI는 첫 버전들이 무엇을 시도할지, 몇 개를 만들지, 어떤 매체로 보여 줄지(그 매체가 보여 줄 수 있는 것과 없는 것 포함), 그리고 각 버전이 어디에 놓일지를 근거와 함께 먼저 알려 줍니다. 그런 다음 실제 버전들을 만들어 가장 먼저 보여 줍니다. 글자 모양의 맞고 틀림처럼 객관적인 정답이 있는 성질은 보여 주기 전에 참조 기준에 대어 먼저 확인하며, 참조 기준에 닿을 수 없을 때는 그 성질을 확인하지 않은 표시와 함께 버전을 볼지 여러분이 결정합니다.

매 라운드마다 여러분은 자기 말로 편하게 반응하면 됩니다. 맞지 않는 곳을 짚고, 유지할 부분과 바꿀 부분을 말하거나, 여러 버전의 조합이나 다른 매체를 요청하거나, 특정 버전에 대해 물어봅니다. 수정을 요청하면 지정한 버전을 바탕으로 새 버전을 만듭니다(요약된 설명에서 다시 생성하지 않습니다). 여러분의 말에 따라 아예 새로 시작하거나 여러 버전을 조합한 새 버전을 만들기도 하며, 필요하면 AI가 제안하는 버전을 함께 내놓기도 합니다. 언제든 그만둘 수 있으며, 그만두면 그때까지의 상태 그대로 멈추고 그때까지 만든 버전들에 요청한 정리 작업을 수행합니다.

<details>
<summary>다른 프로토콜과의 비교</summary>

**Hypotyposis**(ὑποτύπωσις, 개요·밑그림)는 보기 전에는 명세할 수 없는 상태(`FitUnrecognized`)에서 출발해, 형태를 먼저 서술하는 대신 구체적인 버전에 반응하며 목적에 맞는 형태(`RecognizedForm`)를 알아보는 프로토콜입니다.

<a name="다른-프로토콜과의-차이"></a>
### 다른 프로토콜과의 차이

| Protocol | Initiator | Type Signature |
|----------|-----------|---------------|
| Proplasma | Hybrid | `DirectionUnrecognizable → DirectionalContrast` |
| Euporia | Hybrid | `AbstractAporia → ResolvedEndpoint` |
| Heuresis | User-initiated | `CandidateFieldUnderexpanded → DiverseCandidateField` |
| Epharmoge | AI-guided | `ApplicationDecontextualized → ContextualizedExecution` |
| **Hypotyposis** | **Hybrid** | **`FitUnrecognized → RecognizedForm`** |

**이웃 프로토콜과 갈리는 기준**은 지금 필요한 변환이 무엇이냐입니다. 이름 붙은 대안들의 결과를 말만으로는 판단할 수 없을 때는 `/preview`(대비하고, 방향을 정하고, 시제품은 폐기), 아직 이름 붙이지 않은 결정들에 따라 의도가 갈릴 때는 `/elicit`(말과 자료에서 짚어 냄), 완성된 결과를 그것이 놓이는 곳과 실어야 했던 의도에 비춰 볼 때는 `/contextualize`(정한 수정을 반영), 아이디어 후보군을 넓혀야 할 때는 `/ideate`(확장), **만들 형태가 있고 의도는 아직 다 정해지지 않았지만 눈으로 보면 알아볼 수 있을 때는 `/sketch`**(만들고, 짚어내고, 고치고, 알아본 버전을 남김)를 씁니다.

</details>

<details>
<summary>파탄 조건과 근거 문헌</summary>

<a name="파탄-조건-3종"></a>
### 파탄 조건 3종

프로토콜의 정당성은 의도 중계 → 생산 → 라운드 → 사용자의 알아봄 → 기록으로 이어지는 사슬에 있으며, 하나라도 어기면 무너집니다:

| 파탄 | 가드 |
|------|------|
| 보유한 버전들을 고치는 대신 서술에서 버전을 재생성 | 고침은 언제나 보유한 버전들에서 만든 새 버전이고, 보인 버전은 보인 그대로 남는다 |
| 사용자의 말에 대한 AI의 읽기나 AI의 제안을 사용자의 약정으로 취급 | 값은 사용자의 턴 — 그것을 말한 턴, 또는 AI의 것으로 보인 뒤 그것을 받은 턴 — 위에서만 서고, 기록은 어느 쪽인지 적는다 |
| 보이지 않은 것까지 알아봄이 덮는다고 취급 | 알아봄은 버전의 매체가 보인 것까지 닿고 아직 보이지 않은 고침에는 닿지 않는다; 보이지 않은 것은 세워지지 않은 채 남는다 |

<a name="근거-문헌"></a>
### 근거 문헌

설계가 기대는 문헌과, 1차 출처를 확인한 강도(*verified*: 원문 확인; *mostly*: 핵심 주장 확인, 주변 세부는 종합):

- Alexander, C. (1964). *Notes on the Synthesis of Form*. Harvard UP — *verified*. 좋은 적합에는 긍정적 서술이 없고, 부적합은 즉각적이며 열거 가능하다. 형태를 먼저 서술하는 대신 버전에 자기 말로 반응한다는 결정.
- Dorst, K. & Cross, N. (2001). Creativity in the design process: co-evolution of problem–solution. *Design Studies* 22(5) — *mostly*. 문제와 해는 함께 형성된다. 사용자의 말이 정한 것을 매 라운드 전체 컨텍스트 위에서 다시 읽고, 누가 제안했는지는 따로 둔다는 결정.
- Tohidi, M., Buxton, W., Baecker, R. & Sellen, A. (2006). Getting the right design and the design right. *CHI 2006* — *verified*. 안을 하나만 보여주면 평가가 부풀고 비판이 억제된다. 보일 버전 수가 기본값 1이 아니라 생산마다 중계되고 다음 라운드에서 되돌려 보낼 수 있다는 결정.
- Dow, S. et al. (2010). Parallel prototyping leads to better design results, more divergence, and increased self-efficacy. *ACM TOCHI* 17(4) — *verified*. 피드백 전에 만든 대안이 결과와 만드는 이의 몫을 모두 높인다. 대안이 라운드 일정에 고정되지 않고 생산마다 중계되어 다음 라운드에서 되돌려 보낼 수 있다는 결정.
- Wadinambiarachchi, S. et al. (2024). The effects of generative AI on design fixation and divergent thinking. *CHI 2024* — *verified*. 이른 구체물은 이후의 상상을 좁힌다. 무엇이든 만들기 전에 생산 의도를 근거와 함께 중계해 버전을 좁힌 것이 보이게 하고, 의도가 묻지 않은 반응도 받아들인다는 결정.

</details>

## Author
<a name="author"></a>

Jongwon Choi (https://github.com/jongwony)
