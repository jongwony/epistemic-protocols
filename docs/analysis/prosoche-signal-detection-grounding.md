# Prosoche 신호탐지 기반: 위험 게이팅의 인지심리학적 근거와 충실도 분석

> 이 문서는 Prosoche 프로토콜(`/attend`)의 위험 분류·게이팅 메커니즘을 신호탐지이론(Signal Detection Theory, SDT)과 그 결정이론적 후예에 비추어 검증한다.
> Prosoche의 SKILL.md는 "fail-closed"와 "false negative"를 사용하지만 SDT의 핵심 구조(민감도와 기준의 분리, 기저율 항)는 본문에 등장하지 않는다. 이 문서는 (1) 네 학술 참조의 진위를 외부 검증하고, (2) Prosoche의 실제 메커니즘이 SDT를 *구조적으로* 구현하는지 *어휘적으로만* 차용하는지 분석하며, (3) 그 충실도 격차를 개선 이슈 #481과 연결한다.
> Prosoche의 Core Principle("Attention over Automation")은 SKILL.md L232에, fail-closed 동작은 L414·L522에 명시되어 있다.

---

## 배경: 위험 게이팅이 요구하는 두 개의 분리

위험 판단을 SDT로 보면, 자연이 두 상태(신호 있음 / 없음) 중 하나를 제시하고 관찰자가 두 반응(있다 / 없다) 중 하나를 내는 2×2 구조다. 이 틀이 강제하는 통찰은 두 가지다.

1. **민감도(d′)와 기준(criterion)의 분리.** 얼마나 잘 *구별*하는가(d′)와 어디서 경보를 *울릴지*(criterion β/c)는 독립 차원이다. 같은 d′에서도 기준을 옮기면 hit과 false alarm이 함께 움직인다. "더 안전하게 가자"는 기준 이동이지 탐지력 향상이 아니다.

2. **기저율·비용이 최적 기준을 정한다.** 신호가 드물거나(낮은 기저율) false alarm이 비싸면 보수적 기준(높은 문턱)이, 놓침(miss)이 비싸면 자유로운 기준(낮은 문턱)이 최적이다. 따라서 "fail-closed"(놓치느니 막는다)는 *위험이 존재하기 때문에*가 아니라 *놓침 비용 ≫ 오경보 비용*이라는 **비대칭 비용에 근거한 기준 선택**으로만 정당화된다.

이 두 분리가 없으면 위험 분류는 "신호 유형마다 고정된 경보"로 붕괴하며, 낮은 기저율 위험을 과도하게 막고(over-gating) 높은 비용의 놓침을 과소평가하는(under-gating) 실패에 노출된다.

---

## 학술 참조 검증

### Green, D. M., & Swets, J. A. (1966). *Signal Detection Theory and Psychophysics*. Wiley.

- **진위/출처**: 외부 확인 (Wiley 1966, 455쪽, ISBN 0882751395; 1974년 Krieger 재간). SDT 정전.
- **핵심**: 탐지 수행을 **민감도** d′(신호·잡음 분포의 분리도)와 **기준/편향** β(또는 c, 반응 문턱)로 분해. 둘의 관계는 ROC 곡선으로 그려지며, 곡선 아래 면적(AUC = P(A))이 기준에 무관한 탐지력 지표.
- **경계조건**: 원형은 지각 심리물리학(신호·잡음이 정규분포) 가정. 의사결정 영역으로의 이전은 후속 연구(아래 Lynn & Barrett)가 비용·기저율을 결합해 일반화.
- **충실도 함의**: "민감도 ⊥ 기준"이 본 문서 분석의 기준점.

### Meehl, P. E., & Rosen, A. (1955). Antecedent probability and the efficiency of psychometric signs, patterns, or cutting scores. *Psychological Bulletin*, 52(3), 194-216.

- **진위/출처**: 외부 확인 (저자 아카이브 PDF 본문 직접 검증).
- **핵심 발견**: 하나의 징후·컷팅스코어의 효율은 *내재적 타당도(판별력)*와 *기저율*에 **공동으로** 의존한다. 기저율이 50%에서 크게 벗어나면, 약하거나 중간 타당도의 검사를 쓰는 것이 **기저율만 사용하는 것보다 오류를 늘릴 수 있다.**
- **방법·결과**: 컷을 옮겨 의사결정을 개선하는 조건을 부등식으로 명시 — 유효양성 개선 Δp₁ 대 거짓음성 악화 Δp₂의 비가 모집단의 음성/양성 비를 초과해야 한다: `Δp₁/Δp₂ > Q/P`. 즉 기준 이동의 정당성은 기저율(Q/P)에 매여 있다.
- **충실도 함의**: 기저율을 무시한 "위험 유형 → 고정 경보"는 Meehl & Rosen이 경고한 바로 그 실패(기저율보다 나쁜 분류)에 노출된다.

### Kahneman, D., & Tversky, A. (1973). On the psychology of prediction. *Psychological Review*, 80(4), 237-251.

- **진위/출처**: 외부 확인 (doi 10.1037/h0034747; N=871).
- **핵심 발견**: 직관적 예측은 **대표성 휴리스틱**을 따라 사전확률(기저율)과 증거 신뢰도에 둔감해진다. 엔지니어/변호사 과제에서 기저율 30/70을 무시하고 인물 묘사의 대표성으로 판단 — 유사성과 가능성 판단의 상관 r≈.97, 기저율과 가능성 판단의 상관 ≈0.
- **충실도 함의**: 사람(그리고 사람을 모사한 패턴매칭)이 *기본적으로* 기저율을 무시하는 방향으로 편향됨을 보임 → 위험 분류기가 기저율 항을 명시하지 않으면 같은 편향을 물려받는다.

### Lynn, S. K., & Barrett, L. F. (2014). "Utilizing" signal detection theory. *Psychological Science*, 25(9), 1663-1673.

- **진위/출처**: 외부 확인 (PMC 본문 검증).
- **핵심**: 효용 기반 SDT. 최적 편향은 **기저율과 보수(payoff/비용) 구조**에 의해 결정되며, *정확도를 최대화하는 기준 ≠ 효용을 최대화하는 기준*. 드문 표적이나 비싼 오경보 → 보수적 기준(높은 문턱), 비싼 놓침 → 자유로운 기준(낮은 문턱). 편향·민감도·기준의 관계를 Line of Optimal Response로 정식화.
- **충실도 함의**: "fail-closed"를 SDT 언어로 정확히 번역하면 = *놓침이 비싼 영역에서 자유로운 기준을 택함*. 이 정당화는 비용 비대칭에서만 나오며, 정확도(혹은 "위험 존재 여부")만으로는 도출되지 않는다.

---

## 이론 ↔ 프로토콜 매핑 충실도

Prosoche의 실제 메커니즘은 Phase 0 `Classify`(SKILL.md L404-433): 실행 액션을 Risk Signal Taxonomy(L296-318)의 알려진 마커에 패턴매칭하여 `p ∈ {Low, Elevated}`로 분류하고, 심각도는 **신호 유형별로 고정**(Irreversibility→Gate, ExternalMutation→Advisory)되며 환경이 승격시킨다(production→Gate).

| SDT 개념 | Prosoche 구현 | 충실도 |
|----------|---------------|--------|
| 민감도 d′ (판별력) | 모델 없음. 분류는 결정론적 마커 일치(있다/없다). false negative는 "한계"로 인정(L533)하나 ROC 위의 한 점으로 다루지 않음 | **부재** |
| 기준 criterion (문턱) | 존재하나 *암묵적·고정*: 유형→심각도 표가 곧 사전 설정된 기준. 튜닝 가능한 차원이 아님 | **암묵적·미분리** |
| 민감도 ⊥ 기준 분리 | 분리 불가 — 한쪽(민감도)이 아예 없음 | **불성립** |
| 기저율 항 | 명시 부재. `env_context`(dev/prod, L316-318)가 유일한 기저율 유사 변조이나 "환경"으로 프레이밍되고 P(harm)로 다뤄지지 않음 | **약함(프록시)** |
| 비용 비대칭 | *부분적*. Irreversibility→Gate의 근거 "Cannot be undone"(L304)은 사실상 놓침 비용≫오경보 비용 논증 → SDT의 "비싼 놓침→자유로운 기준"과 일치. 그러나 오경보 비용(과도 게이팅·사용자 피로)과 기저율은 저울에 오르지 않음 | **편측 충실** |
| fail-closed | criterion을 보수 측으로 이동(L414 Classify 실패→Elevated, L522 env unknown→Gate). 비용 비대칭에 부분 근거하나 "위험 유형이면 일률 Gate"로 적용 | **disposition은 충실, 구조는 미흡** |

**종합 판정.** Prosoche는 SDT의 **태도(disposition)**는 충실히 계승한다 — fail-closed는 비대칭 비용 아래의 보수적 기준이라는 SDT 처방과 합치하며, "위험이 존재해서"가 아니라 "되돌릴 수 없어서(=놓침이 비쌈)"로 정당화된다(L304). 그러나 SDT의 **구조**는 거의 구현하지 않는다: (1) 민감도 차원이 없어 민감도와 기준이 분리되지 않고, (2) 기저율 항이 없어 Meehl & Rosen이 경고한 과잉·과소 게이팅에 노출되며, (3) 비용 계산이 편측적(놓침 비용만)이다.

주의할 점은 **인덱스 문서(`references/cognitive-psychology.md` §Prosoche)가 SDT 어휘를 프로토콜에 과대 귀속**한다는 것이다. 거기 적힌 "sensitivity / criterion / ROC"는 SKILL.md 본문에 등장하지 않으며, 본문이 실제 쓰는 SDT 흔적은 "fail-closed"와 "false negative"뿐이다. 즉 충실도 격차는 "어휘는 빌렸으나 구조는 없음"보다 더 큰 "어휘조차 인덱스 층의 희망사항"에 가깝다.

---

## 개선 함의 (이슈 #481)

위 충실도 격차는 이슈 #481이 제안하는 방향과 정확히 맞물린다 — 고위험 게이트를 2×2(hit / miss / false alarm / correct reject)로 형식화하고 `base_rate`, `miss_cost`, `false_alarm_cost`, `criterion_reason`을 요구하는 것. 이 문서의 검증이 그 제안에 부여하는 근거:

- **민감도·기준 분리** (Green & Swets): 게이트 결정에서 "이 마커가 실제 위험을 얼마나 잘 가리는가(판별력)"와 "어디서 막을 것인가(기준)"를 구분하면, 약한 판별력의 마커를 보수적 기준으로 메우는 현재 방식의 한계가 드러난다.
- **기저율 항** (Meehl & Rosen, K&T): `base_rate`를 명시하면 같은 신호 유형이라도 "이 맥락에서 실제 해가 드문가"를 저울에 올려 과잉 게이팅을 줄인다. K&T는 이 항을 *명시하지 않으면* 기본 편향이 그것을 무시함을 보인다.
- **양측 비용** (Lynn & Barrett): `miss_cost`와 `false_alarm_cost`를 함께 요구하면 fail-closed의 편측성이 교정되고, `criterion_reason`이 "비싼 놓침이라서"라는 SDT 정당화를 명시하게 한다.

**경계(중요).** 런타임 AI 게이트는 교정된 수치 d′나 정량 기저율을 공급할 수 없다. 따라서 2×2는 **정량 모델이 아니라 추론 프레임**으로 도입되어야 한다 — `base_rate`는 "높음/낮음/모름", 비용은 "놓침이 오경보보다 비싼가?"의 정성 판단으로. 이는 Prosoche의 기존 규율(Plain emit, L561; 교정 불가한 확률을 함의하지 않기)과도 일관된다. SDT는 여기서 *측정 도구*가 아니라 *무엇을 빠뜨리지 말지 알려주는 점검 구조*다.

이 절의 제안은 채택된 사양이 아니라 문헌이 함의하는 설계 방향이며, 실제 SKILL.md 반영은 별도 설계 결정이다.

---

## Cross-references

- `prosoche/skills/attend/SKILL.md` (대상 프로토콜; Core Principle L232, Risk Signal Taxonomy L296-318, Phase 0 Classify L404-433, fail-closed L414·L522, Known Limitations L527-535)
- `references/cognitive-psychology.md` §Prosoche (1줄 인덱스; 본 문서가 심층 층 — 단 인덱스의 SDT 어휘 귀속은 본 문서 충실도 분석에서 과대 귀속으로 정정)
- Issue #481 (Prosoche: 고위험 게이트를 2×2 신호탐지 표로 형식화)
- `references/boundaries.md` (Prosoche가 확장하는 irreversible 분류; 놓침 비용의 외부 근거)
