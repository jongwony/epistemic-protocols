# Aitesis 인지심리학적 Grounding: 질문하기의 메커니즘과 매핑 충실도

> 이 문서는 Aitesis(`/inquire`) 프로토콜이 의존하는 인지심리학 문헌을 검증하고,
> 프로토콜의 실제 메커니즘(SKILL.md)이 그 이론을 얼마나 충실히 구현하는지를 분석한다.
> 대상은 "질문하기"의 인지과학 — 화행·함축, 정보격차/호기심, 질문의 정보이득,
> 대화 grounding, 그리고 요구 도출 편향이다.
> Aitesis의 Core Principle("Evidence over Inference over Detection")은 SKILL.md L199에 명시되어 있다.
> 한 줄 요약 매핑은 `references/cognitive-psychology.md` §Aitesis에 있으며, 이 문서는 그 심층 층이다.

---

## 배경: Aitesis가 전제하는 "좋은 질문"의 메커니즘

Aitesis는 실행 전 컨텍스트 불충분을 추론해 정보이득 우선순위로 질문하는 프로토콜이다(L8, L12). 그런데 SKILL.md는 "정보이득", "질문", "우선순위" 같은 용어를 *단언적으로* 사용할 뿐, 그 인지과학적 근거를 담지 않는다(설계 근거는 rules/SKILL이 아니라 이 레이어가 담당). 좋은 질문하기는 네 가지 독립 메커니즘의 합이다:

1. **질문은 화행이다** — 정보 요청만이 아니라, 협력 원리(implicature) 아래에서 수행되는 행위(Searle; Grice).
2. **질문은 정보격차에서 나온다** — 보유 지식과 목표 지식 사이의 간극이 질문을 구동한다(Loewenstein).
3. **질문은 부트스트랩 문제를 안는다** — 무엇을 모르는지 알려면 충분히 알아야 한다(Miyake & Norman).
4. **질문은 정보이득으로 최적화되나, 그 척도가 하나가 아니다** — diagnosticity / information gain / probability gain / impact는 서로 갈린다(Nelson).
5. **질문의 표현은 편향을 주입한다** — 요구 도출에서 유도질문은 앵커링·요구 고착을 부른다(Mohanani et al.).

그리고 답은 받는 순간 끝나지 않는다 — 대화는 제시(presentation)와 수용(acceptance)의 2단계로 grounding된다(Clark & Schaefer).

---

## 학술 참조 검증

각 문헌의 진위·핵심·방법·경계·재현성을 외부 소스로 확인했다(Tavily 검색 기반). 상태: **확인**(외부 소스 일치) / **정전**(canonical, 특성 확립·본문 추출 생략).

### Searle 1969, *Speech Acts* — 정전
- **출처**: Cambridge University Press. 언어철학의 표준 문헌(특성 확립, 본문 외부 추출 생략).
- **핵심**: 발화는 명제 내용과 더불어 *발화수반력(illocutionary force)*을 갖는다 — 단언/질문/요청/약속/명령 등은 서로 다른 화행. 질문은 "요청(directive)"의 하위 유형으로, 화자가 정보를 결여하고 청자가 그것을 제공할 수 있다는 예비조건(preparatory condition)을 전제.
- **프로토콜 함의**: 질문을 단일 범주가 아니라 발화수반력으로 *유형화*할 근거.

### Grice 1975, "Logic and Conversation" — 정전
- **출처**: in *Syntax and Semantics, Vol. 3* (제공된 PDF: lawandlogic.org). 화용론의 표준 문헌.
- **핵심**: 협력 원리와 네 격률(양·질·관계·방식). 발화의 의미는 문자적 내용을 넘어 *함축(implicature)*을 통해 전달된다. 질문 과잉은 양의 격률을, 관련 없는 질문은 관계의 격률을 위반.
- **프로토콜 함의**: 질문 수/순서/관련성에 대한 규율의 근거(양·관계 격률).

### Loewenstein 1994, "The Psychology of Curiosity" — 확인
- **출처**: *Psychological Bulletin*, 116(1), 75-98. DOI 10.1037/0033-2909.116.1.75 (다중 소스 교차 확인).
- **핵심**: 정보격차 이론(information-gap theory). 호기심은 "지식의 간극에 주의가 집중될 때" 발생하는 결핍 상태이며, 개인은 그 결핍을 줄이려 missing information을 추구.
- **경계조건**: 격차는 *기존 지식 구조에 상대적*이다 — 사전 지식 네트워크에 간극이 현저(salient)해질 때 유발된다. 즉 격차 감지 자체가 보유 지식을 전제(아래 Miyake & Norman과 직접 연결).
- **재현성**: 후속 연구(Golman & Loewenstein 2018; Kang et al. 2009 — 호기심의 보상회로/기억 강화)로 확장·지지됨.

### Miyake & Norman 1979, "To Ask a Question, One Must Know Enough to Know What Is Not Known" — 확인
- **출처**: *Journal of Verbal Learning and Verbal Behavior*, 18, 357-364. 원본은 UCSD CHIP Report No. 7802(1978), DTIC ADA063309(doi 10.21236/ada063309) — 제공된 DTIC URL 확인.
- **핵심**: 질문을 던지려면 "그것을 형성하고 답을 해석할 적절한 지식 구조"가 필요하다. 적절한 질문을 떠올리는 능력은 *해당 주제 지식의 복잡한 함수*.
- **방법·결과**: 학습자에게 난이도가 다른 자료를 제시 — 배경지식이 있는 학습자는 질문을 생성했으나, 없는 학습자는 무엇을 물어야 할지 식별하지 못함(부트스트랩 비대칭).
- **인용 주의**: 일부 2차 인용이 페이지를 "557-564"로 잘못 표기(예: Graesser 1994) — 표준은 357-364. 출판 전 1차 확인 권장.

### Nelson 2005, "Finding Useful Questions" — 확인
- **출처**: *Psychological Review*, 112(4), 979-999 (PsycNet 확인). **정오표 존재**: Vol 114(3), 2007 — Table 13 수치 정정.
- **핵심**: 질문 유용성의 규범이 여럿이다 — Bayesian diagnosticity, information gain(상호정보), KL distance, probability gain(오류 최소화), impact(절대 변화). 전산 최적화 결과 정보이득·확률이득·impact가 diagnosticity와 *강하게 충돌하는 상황*이 존재하며, 새 실험은 Bayesian diagnosticity를 강하게 반증. diagnosticity는 규범적으로 결함·경험적으로 정당화 불가로 결론.
- **방법·결과**: 기존 실험의 확률 모델 + 신규 실험. 핵심 경고 — "information bias": 믿음은 바꾸지만 정답 확률은 높이지 않는 질문을 선호하는 경향(정보이득/impact 모델도 이 편향을 보임). **척도 선택이 결과를 가른다.**
- **프로토콜 함의**: "정보이득"을 단일 척도로 쓰면 *행동을 바꾸지 않는데 불확실성만 줄이는* 질문을 surface할 위험.

### Clark & Schaefer 1989, "Contributing to Discourse" — 확인
- **출처**: *Cognitive Science*, 13(2), 259-294 (PhilPapers·다중 2차 소스 확인). Clark 1992 *Arenas of Language Use* 5장으로도 수록.
- **핵심**: 기여(contribution)는 *제시 단계(presentation)* + *수용 단계(acceptance)*의 2단계. grounding criterion = "화자가 의도한 바를 청자가 현재 목적에 충분할 만큼 이해했다는 상호 믿음". 수용 증거의 다섯 장치(acknowledgment, display, demonstration, 관련 다음 기여 개시, 지속 주의)와 Strength of Evidence Principle.
- **프로토콜 함의**: 답을 *받는 것*과 답을 *grounding하는 것*은 다르다 — 수용 단계 없이 답을 통합하면 오해가 그대로 실행에 반영될 수 있음.

### Mohanani, Salman, Turhan, Rodríguez, Ralph 2020 — 확인
- **출처**: "Cognitive Biases in Software Engineering: A Systematic Mapping Study." *IEEE TSE*, 46(12), 1318-1339. DOI 10.1109/TSE.2018.2877759 (Monash·computer.org·oulu repo 교차 확인).
- **핵심**: SE 전반의 인지편향(원인·효과·debiasing) 체계적 매핑. 요구공학 인접 문헌으로 요구 고착(requirements fixation, Mohanani et al. 2014)·앵커링&조정(Parsons & Saunders 2004)·도출 절차 프롬프트(Pitts & Browne 2007) 포함.
- **프로토콜 함의**: 질문/선택지의 *표현*이 사용자를 앵커링하거나 요구를 고착시킬 수 있음 — 도출 단계의 debiasing 근거.

---

## 이론 ↔ 프로토콜 매핑 충실도

| 이론 요소 | Aitesis 구현(SKILL.md) | 충실도 |
|---|---|---|
| 부트스트랩(Miyake & Norman): 모르는 걸 알려면 충분히 알아야 | Phase 0 scan + `trivially_inferrable` + **Default-scan trigger**(L250): "탐지가 이미 관여를 의심할 것을 요구하는데, 그게 바로 신호가 드러내려는 조건" | **충실** (오히려 정교) |
| 정보격차(Loewenstein): 보유 vs 목표 지식의 간극 | 게이트 술어 `∃ requirement(r,X): ¬available(r) ∧ ¬trivially_inferrable(r)`(L219) = 구조적 격차 탐지기 | **충실(구조)** / 동기층 비대상 |
| 정보이득 최적화(Nelson): 척도가 *여럿*이며 갈린다 | "정보이득 = 남은 불확실성 공간을 얼마나 좁히나"(L281, L445)를 *단일* 비공식 척도로 사용 | **부분** (척도 미분화) |
| 화행(Searle): 발화수반력 유형 | 질문을 단일 "Inquiry(Constitution)"로 처리 — 발화수반력 유형화 없음 | **이탈** |
| 함축(Grice): 양·관계 격률 | 불확실성 캡(클러스터 ≤4, L475)·Plain emit(L508)이 양·방식 격률을 *암묵적*으로 준수; 명시적 함축 모델 없음 | **부분(암묵)** |
| grounding(Clark & Schaefer): 제시+수용 2단계 | Phase 2 제시 → 답 파싱 → Phase 3 통합. *수용/상호이해 확인 단계 부재* | **이탈/부분** |
| 도출 편향(Mohanani): 앵커링·요구 고착 | Gate integrity·Option-set relay test(L502, L507)는 선택지 *조작*을 막으나, 질문 *표현*의 앵커링 debiasing은 없음 | **이탈** |

### 충실한 지점
- **부트스트랩 처리가 백미다.** Default-scan trigger(L250)는 Miyake & Norman의 비대칭에 대한 엔지니어링 해법이다 — 프로토콜이 단순 인용을 넘어 이론적 난점을 *구조로* 풀었다. 정보격차 게이트 술어(L219)도 Loewenstein의 격차 개념을 거의 문자 그대로 구현한다(단 동기·정서층은 의도적으로 범위 밖).

### 이탈/부분 지점 (신규 문헌의 레버리지)
- **정보이득 척도 미분화(Nelson)**: Aitesis의 "불확실성 공간 좁히기"는 information gain/impact에 가깝고 probability gain(정답 확률 개선)과 구별되지 않는다. Nelson의 "information bias" 경고가 그대로 적용 — *믿음은 바꾸지만 행동은 안 바꾸는* 질문이 높은 우선순위를 받을 수 있다.
- **발화수반력 미유형화(Searle)**: 모든 질문이 같은 화행 범주. 확인(confirm)과 권한요청(request-authorization)은 사용자 부담·실패양식이 다른데 동일 취급.
- **수용 단계 부재(Clark & Schaefer)**: Phase 3는 답을 통합하지만, AI가 답을 *제대로 이해했는지* 상호확인하는 grounding이 없다. 고부담 답변에서 오통합 위험.
- **도출 debiasing 부재(Mohanani)**: 선택지 프레이밍이 사용자를 앵커링해도 이를 교정하는 패스가 없다.

---

## 개선 함의 (이슈 #478과 연결)

아래는 *문헌이 함의하는 설계 방향*이며 채택된 사양이 아니다. 위 이탈/부분 지점에 정확히 대응한다:

1. **질문의 발화수반력 유형화** (Searle → #478 QuestionAct): `clarify | confirm | request-evidence | request-preference | request-authorization`. 발화수반력별로 예비조건과 사용자 부담이 다르므로, 유형이 곧 우선순위·표현 규율의 입력이 된다.
2. **정보이득 랭킹의 다축화** (Nelson → #478 info-gain ranking): 단일 "공간 좁히기"를 `기대 정보이득 × 분기 영향(impact/probability gain) ÷ 사용자 부담`으로 분해. "분기 영향" 항이 곧 Nelson의 impact/probability-gain 축으로, *행동을 바꾸지 않는* 질문의 과대평가(information bias)를 억제.
3. **도출 편향 차폐** (Mohanani → #478 bias shield): 묻기 전 anti-anchor / anti-confirmation 변형을 생성해 가장 덜 유도적인 형태로 수렴. 요구 고착(requirements fixation)에 대한 직접 대응.
4. **(추가 발견) 수용·grounding 확인** (Clark & Schaefer — #478 범위 밖, 별도 후보): 고부담 답변에 한해 AI가 통합 의도를 1줄로 되비추어(paraphrase-back) 사용자 수용을 받는 경량 acceptance 단계. 이슈에는 미반영 — 본 분석에서 도출된 신규 설계 후보로 기록.

위 1~3은 이미 #478에 담긴 제안과 일치하며, 본 grounding이 그 *근거*를 제공한다. 4는 이 심층 분석에서 새로 떠오른 항목이다.

---

## Cross-references

- `aitesis/skills/inquire/SKILL.md` — 분석 대상 프로토콜 (Core Principle L199; Default-scan L250; 정보이득 L281·L445; 게이트 술어 L219)
- `references/cognitive-psychology.md` §Aitesis — 한 줄 인덱스 층 (이 문서는 그 심층)
- 이슈 #478 — Aitesis 개선 제안 (QuestionAct 유형화 + 정보이득 랭킹 + 도출 편향 차폐); 본 문서가 근거 베이스
- `docs/philosophical-anchors.md` — 시스템 차원 A2/A5(Constitution) 근거 (Phase 2 Constitution move의 상위 근거)
