# 인지부하와 게이트 연쇄: 프로젝트 전역 Grounding

> 이 문서는 epistemic-protocols의 emit 규율("Plain emit discipline", "round-local
> salience bundling")과 게이트 연쇄(gate chain)의 인지심리학적 근거를 검증하고,
> 각 이론과 설계 간 매핑의 구조적 충실도를 분석한다.
> 핵심 미해결 문제 — *연쇄된 사용자 게이트의 누적 결정부하* — 는
> `epistemic-cooperative/skills/compose/SKILL.md`에서 "not yet formally modeled"로
> 명시되어 있으며(L80, L199), 개선 이슈 #482(GateLoadBudget)가 이 문서를 근거로 한다.
> 이 문서의 무결성은 **논쟁적 결과(결정피로·선택과부하)를 정직하게 다루는 데** 달려 있다.

---

## 배경

epistemic-protocols는 "인지부하"를 거의 모든 프로토콜에서 명목상 호출하지만(emit 규율 보일러플레이트), 그 부하를 학술적으로 근거화한 적이 없다. 근거화의 축은 셋이다.

1. **작업기억의 유한성** — 동시에 활성 상태로 유지할 수 있는 정보 항목 수에는 엄격한 상한이 있다(Miller 1956의 7±2, 더 보수적으로 Cowan 2001의 ~4 청크). emit 규율과 게이트 설계가 다루려는 자원이 바로 이 한정된 작업기억이다.

2. **외재적 부하 감소 / 분할주의 통제** — 인지부하이론(Sweller 1988)은 학습/처리에 본질적이지 않은 외재적(extraneous) 부하를 줄이면 한정 자원을 본질 과제에 더 쓸 수 있다고 본다. 정보가 여러 출처로 분산되면 분할주의(split-attention) 효과로 부하가 가중된다(Chandler & Sweller 1991). 프로젝트의 "Plain emit"(군더더기 제거)과 "round-local salience bundling"(현재 판단·근거·다음 함의를 한곳에 묶기)은 정확히 이 외재적 부하 감소·분할주의 통제에 대응한다.

3. **게이트 연쇄의 누적 부하 (미해결)** — 단일 게이트의 순간 부하가 아니라, 여러 게이트가 연쇄될 때 누적되는 결정부하다. `compose/SKILL.md`는 이를 인정한다: per-gate 정적 측정은 있으나(조건부 엔트로피 `Σ log₂(|options_i|)` bits, gate density, Constitution ratio — L182-199), *chain-position × regret* 상호작용은 "valid but not yet addressed"이며 미래 개정에서 "decision load model that quantifies remaining gate cost (loop depth × regret weight)"를 도입할 예정이라고 적는다(L80). 이 미해결 영역이 #482의 표적이다.

**그러나 결정적 사실**: 이 누적 부하 갭은 하필 *경험적 증거가 가장 취약한 영역*(결정피로·선택과부하)과 겹친다. 따라서 본 grounding의 핵심은 "어디까지가 탄탄한 근거이고 어디부터가 설계 경고인가"를 가르는 것이다.

## 학술 참조 검증

### 탄탄한 근거 (작업기억 한계 · 인지부하이론)

- **Miller, G. A. (1956). The Magical Number Seven, Plus or Minus Two.** *Psychological Review*, 63(2), 81-97. — 진위: canonical, 외부 확인. 절대판단과 즉시기억의 채널 용량이 약 7±2 청크로 수렴한다는 고전. 단 "청크" 단위는 부호화에 의존(재부호화로 용량 확장 가능)하므로, 7±2는 항목 수의 절대상한이 아니라 청크 수의 경험적 중심값이다 — 경계조건으로 명시 필요.
- **Cowan, N. (2001). The Magical Number 4 in Short-Term Memory.** *Behavioral and Brain Sciences*, 24(1), 87-114. — 진위: canonical, 외부 확인. 재부호화·리허설을 통제하면 순수 작업기억 용량은 ~4 청크로, Miller보다 보수적. 게이트 설계의 안전한 상한으로는 7보다 4가 적절.
- **Sweller, J. (1988). Cognitive Load During Problem Solving: Effects on Learning.** *Cognitive Science*, 12(2), 257-285. — 진위: **외부 확인(Tavily)**. 인지부하이론의 출발점. 작업기억 용량이 한정되어 있고, 본질적이지 않은 외재적 부하가 학습/처리를 저해한다. 효과적 설계는 외재적 부하를 줄이는 것.
- **Chandler, P., & Sweller, J. (1991). Cognitive Load Theory and the Format of Instruction.** *Cognition and Instruction*, 8(4), 293-332. — 진위: canonical, 외부 확인(CLT 문헌 다수 교차참조). 분할주의 효과: 통합되어야 할 정보가 물리적·시간적으로 분산되면 부하가 가중되며, 통합 제시가 이를 완화. "dozens of experiments... overwhelmingly negative consequences"로 분할주의의 강건성이 보고됨(Sweller/van Merriënboer/Paas 1998).
- **Sweller, J., & Chandler, P. (1994). Why Some Material Is Difficult to Learn.** *Cognition and Instruction*, 12(3), 185-233. — 진위: canonical, 외부 확인. 요소 상호작용성(element interactivity)이 높을수록 동시에 작업기억에 올려야 할 항목이 많아져 본질적(intrinsic) 부하가 커진다.

이 다섯은 emit 규율과 작업기억 기반 게이트 상한을 **강건하게** 뒷받침한다.

### 논쟁적 근거 (선택과부하 · 결정피로) — 재현성 경고 동반

- **Iyengar, S. S., & Lepper, M. R. (2000). When Choice Is Demotivating.** *Journal of Personality and Social Psychology*, 79(6), 995-1006. — 진위: canonical(유명한 "jam study", 24 vs 6 선택지). 선택과부하의 원전이나, 후속 재현에서 일관되게 재생되지 않음.
- **Scheibehenne, B., Greifeneder, R., & Todd, P. M. (2010). Can There Ever Be Too Many Options? A Meta-Analytic Review of Choice Overload.** *Journal of Consumer Research*, 37(3), 409-425. — 진위: **외부 확인(Tavily, 원문 PDF)**. 50개 실험·63개 조건의 메타분석 결과 **"overall mean effect size... was virtually zero"**. 효과크기 분산은 높음(소수 연구가 큰 양/음 효과). 사전 선호가 명확하면 오히려 "more is better". 즉 선택과부하는 **보편 법칙이 아니라 맥락 의존적**. (후속 Chernev et al. 2015는 결정난이도·선택집합 복잡도·선호 불확실성·결정목표 네 조절변수 하에서는 강건한 효과가 있다고 재해석 — 조건부 존재.)
- **Vohs, K. D., et al. (2008). Making Choices Impairs Subsequent Self-Control.** *Journal of Personality and Social Psychology*, 94(5), 883-898. — 진위: **외부 확인(Tavily)**. 결정피로(decision fatigue)의 핵심 원전. 선택 행위가 후속 자기통제를 고갈시킨다는 한정자원(limited-resource) 모델. 쇼핑몰 현장연구 등 다수 실험. 그러나 이 모델(ego depletion)이 아래에서 도전받음.
- **Hagger, M. S., et al. (2016). A Multilab Preregistered Replication of the Ego-Depletion Effect.** *Perspectives on Psychological Science*, 11(4), 546-573. — 진위: **외부 확인(Tavily, 원문 PDF)**. 23개 연구실·N=2,141의 사전등록 다중연구실 재현에서 ego-depletion 효과가 **영과 유의하게 다르지 않음**("consistent with a null effect"; 인용 추정 d=0.04, 95% CI[-0.07, 0.15]). 결론: "if there is any effect, it is close to zero." (단 Baumeister & Vohs 2016 "Misguided Effort" 반박이 존재 — 절차 적합성 논쟁. 그럼에도 자원고갈 모델의 강건성은 크게 흔들림.)

**판정**: 선택과부하와 결정피로는 *정량 법칙으로 인용 불가*. Scheibehenne 2010은 평균효과 ≈ 0, Hagger 2016은 ego-depletion 영효과. 이 둘은 GateLoadBudget에서 **설계 경고(soft warning)**로만 쓰여야 한다.

## 이론 ↔ 설계 매핑 충실도

| 이론 | 프로젝트 적용 | 충실도 |
|------|--------------|--------|
| 작업기억 유한성 (Miller 1956 / Cowan 2001) | emit 규율 전반의 암묵 전제; 동시 미해결 결정 수 상한의 근거 | **정합 (높음)** — 단 7이 아니라 4를 상한으로 |
| 외재적 부하 감소 (Sweller 1988) | "Plain emit discipline" (군더더기·과잉형식 제거) | **정합 (높음)** |
| 분할주의 통제 (Chandler & Sweller 1991) | "Round-local salience bundling" (판단·근거·함의를 한 라운드에 통합) | **정합 (높음)** — 통합 제시 = 분할주의 완화의 직접 대응 |
| 정보이론적 결정부하 | `compose` 조건부 엔트로피 `Σ log₂(|options_i|)` bits, gate density, Constitution ratio (L182-199) | **부분** — 순간 per-gate 부하는 측정하나 *누적·순차*는 미측정 |
| 누적 결정부하 (chain-position × regret) | `compose` L80 "valid but not yet addressed"; 미래 "loop depth × regret weight" 모델(미구현) | **미반영 (갭)** |
| 선택과부하 / 결정피로 | (명시적 적용 없음; 누적 부하 모델의 잠재 근거 후보) | **근거 취약** — 정량 적용 금지 |

**산문 분석**:

프로젝트의 *순간* 부하 처리는 충실도가 높다. `compose`의 조건부 엔트로피 `Σ log₂(|options_i|)`는 게이트당 선택지 수를 정보비트로 환산해 사용자 결정부하를 정량화하며(L199), 이는 작업기억에 동시에 올라가는 선택지 수를 비트로 본다는 점에서 Miller/Cowan·Sweller와 정합적이다. gate density와 Constitution ratio(L186-188)도 같은 결의 정적 지표다.

갭은 *누적·순차* 차원이다. `compose`는 게이트들을 독립적으로 처리(L80: "Phase 3 disposition operates per-gate without chain-position awareness")하므로, 연쇄 후반의 게이트가 누적 부하 하에서 판단 품질이 떨어질 가능성을 모델링하지 못한다. 프로젝트 스스로 이를 "valid but not yet addressed"로 인정하고 "loop depth × regret weight" 모델을 예고한다.

그런데 이 갭을 채울 *순차 부하 가중*의 자연스러운 경험적 후보 — 결정피로(Vohs 2008) — 가 바로 재현 실패한 영역이다(Hagger 2016). 마찬가지로 "선택지가 많을수록 나쁘다"는 직관적 전제도 메타분석에서 평균효과 ≈ 0이다(Scheibehenne 2010). **즉 갭의 위치와 증거 취약성의 위치가 일치한다.** 이 정합은 우연이 아니라 경고다: 누적 부하 모델을 *피로 기반 하드 패널티*로 구현하면 흔들리는 증거 위에 정량 법칙을 세우는 것이 된다.

따라서 충실도 관점의 결론은 이중적이다 — (a) emit 규율과 per-gate 엔트로피는 탄탄한 근거 위에 있으니 더 명시적으로 근거화해도 되고, (b) 누적 부하 모델은 *탄탄한 부분(작업기억 상한·외재적 부하·정보 엔트로피)*에만 정량적으로 기대고, *취약한 부분(피로·과부하)*은 방향성 경고로만 써야 한다.

## 개선 함의

이슈 **#482 (GateLoadBudget)** 에 대한 근거 기반 방향. 모두 *문헌이 함의하는 설계 방향*이지 채택된 사양이 아니다.

- **하드 근거로 셀 것** (정량화 가능):
  - *동시 미해결 결정 수* — Cowan 2001의 ~4를 보수적 상한으로. 미해결 게이트가 이를 넘으면 묶기/기본값/통합.
  - *게이트당 대안 수* — 이미 있는 `Σ log₂(|options_i|)` 엔트로피를 재사용(신규 측정 불필요, `compose` L199 확장).
  - *맥락 전환·기억 이월* — 분할주의(Chandler & Sweller 1991) 근거. 게이트 간 사용자가 다시 떠올려야 하는 항목 수를 줄이도록 인접 게이트를 통합.
- **소프트 경고로만 쓸 것** (정량화 금지):
  - *결정피로 누적 패널티* — Hagger 2016 영효과. "후반 게이트일수록 패널티"를 정량 계수로 박지 말 것. `compose`가 예고한 "loop depth × regret weight"에서 **regret 가중(비대칭 비용)은 건전하나** loop-depth를 *피로 승수*로 해석하면 과잉주장.
  - *선택지 과다 = 악* 전제 — Scheibehenne 2010 평균효과 ≈ 0. 선택지 수 자체보다 *선호 불확실성·비교 난이도*(Chernev 2015 조절변수)가 실제 부하원. 따라서 "옵션을 줄여라"가 아니라 "옵션을 비교 가능하게/선호를 명확히"가 더 정확한 처방.

요컨대 GateLoadBudget은 **작업기억 상한 + 정보 엔트로피 + 분할주의**라는 단단한 삼각대 위에 세우고, 피로·과부하는 난간(경고)으로 두는 것이 증거 정합적이다.

## Cross-references

- `epistemic-cooperative/skills/compose/SKILL.md` — 누적 게이트 부하 미해결 문제(L80)와 기존 정적 측정(L182-199); 본 문서가 그 근거 층
- `references/cognitive-psychology.md` §Project-wide 인지부하 — 1줄 인덱스(본 문서가 심화)
- `docs/analysis/horismos-philosophical-foundations.md` — 동일 grounding 문서 패턴(템플릿)
- 개선 이슈 #482 (Project-wide: model cumulative gate-chain load / GateLoadBudget)

## 검증 상태 요약

- **외부 확인(Tavily, 2026-05/06 pass)**: Sweller 1988, Scheibehenne et al. 2010(원문 PDF, "mean effect ≈ zero"), Vohs et al. 2008, Hagger et al. 2016(원문 PDF, null effect).
- **Canonical(확립된 지식, 재추출 안 함)**: Miller 1956, Cowan 2001, Chandler & Sweller 1991, Sweller & Chandler 1994, Iyengar & Lepper 2000. 출판/공개 전 정확한 pagination spot-check 권장.
- **무결성 노트**: 본 문서의 핵심 주장(누적 부하 모델은 취약 증거 영역과 겹친다)은 Hagger 2016·Scheibehenne 2010의 외부 확인에 직접 근거한다.
