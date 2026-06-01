# Cognitive Psychology (Layer 2 — Mechanism)

인지심리학 도메인 참조. 각 프로토콜이 **어떻게 작동하는가**(Mechanism)에 대한 학술적 근거를 제공한다. `references/README.md`의 설계 원칙대로, 여기 담긴 지식은 프로토콜의 **설계 근거**이지 실행 지시가 아니다 — 프로토콜이 올바르게 설계되었으면 이 메커니즘은 이미 구조에 인코딩되어 있다.

**Audience**: Contributor-facing. 런타임 자동 로드 없음. 사용자가 "왜 이 메커니즘인가?"를 물을 때, 또는 새 프로토콜 설계·기존 프로토콜 개선 시 참조.

**관계**: 정당화(왜 이렇게 하는가)는 `epistemology.md`, 기술(무엇이 일어나는가)·현상학적 근거는 `phenomenology.md`와 `docs/philosophical-anchors.md`, 구조(어떻게 연결되는가)는 `category-theory.md`가 담당. 이 문서는 그 사이의 **작동 메커니즘** 층이다. Anamnesis의 Husserl 현상학과 Katalepsis의 Stoic grasp은 `docs/philosophical-anchors.md`에 이미 근거화되어 있어 여기서는 인지심리학 메커니즘 층만 보강하고 cross-ref한다.

---

## §Mechanism 앵커: 고레버리지 프로토콜

질문하기·빈틈·구조매핑·위험주의 네 프로토콜은 각자의 핵심 기능을 정의하는 인지심리학 메커니즘이 명확하나, 기존 SKILL.md에서는 단언적으로만 기술되어 있었다. 아래는 그 작동 메커니즘의 학술 근거와 설계 함의다.

### Aitesis (`/inquire`) — 질문하기의 메커니즘

좋은 질문은 "빠진 사실 묻기"가 아니다. **협력적 함축**(Grice 1975) 아래에서 수행되는 **화행**(Searle 1969)이며, 수용을 통해 grounding되고(Clark & Schaefer 1989), 기대 정보이득과 하류 결정영향으로 최적화된다(Nelson 2005). 호기심 자체가 **정보격차**(현재 지식과 목표 지식 사이의 간극)에 의해 구동된다는 점(Loewenstein 1994)은, 질문 우선순위가 "무엇을 모르는가"가 아니라 "어떤 간극이 결정에 가장 크게 작용하는가"로 정해져야 함을 함의한다. 또한 충분히 알아야 무엇을 모르는지 알 수 있다는 비대칭(Miyake & Norman 1979)은 질문 생성이 사전 지식에 제약됨을 보여준다. 요구사항 도출 맥락에서 유도질문은 앵커링·확증편향을 주입한다(Mohanani et al. 2020).

**설계 함의**: 질문을 화행 유형으로 명시(`clarify | confirm | request-evidence | request-preference | request-authorization`)하고, `기대 정보이득 × 분기 영향 ÷ 사용자 부담`으로 랭킹. 묻기 전 anti-anchor / anti-confirmation 변형을 생성해 가장 덜 유도적인 형태로 수렴(편향 차폐).

### Syneidesis (`/gap`) — 빈틈이 보이지 않는 메커니즘

빈틈을 놓치는 데에는 두 인지적 원인이 있다. 첫째, **누락편향** — "아무것도 하지 않음"이 잘못된 행동보다 안전하게 느껴져 부작위 위험이 과소평가된다(Ritov & Baron 1990). 둘째, 미래 실패가 미명세 상태로 남는다. **Prospective hindsight**(미래의 한 시점에서 "이미 실패했다"고 가정)는 사건 설명을 위한 이유 생성을 약 30% 증가시킨다(Mitchell, Russo & Pennington 1989), 이것이 **premortem** 기법의 인지적 기반이다(Klein 2007). 체크리스트는 짧고 구체적이며 알려진 실패모드에 결속될 때 실제로 합병증·사망률을 낮춘다(Pronovost et al. 2006; Haynes et al. 2009) — 즉 효과는 길이가 아니라 결속에서 온다. "반대를 고려하라"는 명시적 지시는 확증편향을 교정한다(Lord, Lepper & Preston 1984).

**설계 함의**: 갭 분류 이전에 `PremortemPass`("이 결정이 실패했다 가정 → 이유 나열")를 두고, `omission-risk`를 절차/고려/가정/대안과 나란한 1급 갭 타입으로 추가. 체크리스트는 온톨로지 확장이 아니라 프로토콜당 5~9항 고위험 항목으로 유지.

### Analogia (`/ground`) — 구조매핑의 메커니즘

유추는 표면 유사가 아니라 **관계 구조**, 특히 **고차 인과관계**가 매핑될 때 타당하게 전이된다(Gentner 1983, structure-mapping theory). 표면 유사성은 인출(retrieval)은 돕지만 추론 건전성을 오도할 수 있다(Holyoak & Koh 1987; Gentner, Rattermann & Forbus 1993) — 검색에 좋은 유사성과 추론에 좋은 유사성이 분리된다. 두 구체 사례를 먼저 비교해 공통 관계를 추출하는 **유추적 부호화**(analogical encoding)는 원전이(far transfer)를 크게 개선한다(Gick & Holyoak 1980/1983; Gentner, Loewenstein & Thompson 2003).

**설계 함의**: 막연한 "이게 매핑되나?" 대신 `MappingLedger` — 기저 객체 / 표적 객체 / 1차 관계 / 고차 인과관계 / 미매핑 잔여 / 금지된 추론. "비교 → 공통 관계 추상화 → 표적 적용" 순서를 명시(유추적 부호화 무브). 표면 유사만으로 매핑을 통과시키지 않도록 고차 관계 일치를 요구.

### Prosoche (`/attend`) — 위험 게이팅의 메커니즘

신호탐지이론(Green & Swets 1966)은 위험 판단에 두 독립 분리가 필요함을 보인다. (1) **민감도(d′) vs 기준(criterion)** — 탐지 능력과 경보 문턱은 별개다. (2) **기저율 증거 vs 생생한 사례 매칭** — 사람은 기저율을 무시하고 대표성에 끌린다(Kahneman & Tversky 1973; 진단에서의 기저율 효율은 Meehl & Rosen 1955). 따라서 "fail-closed"는 *위험이 존재해서*가 아니라 *비대칭 비용*(miss 비용 ≫ false-alarm 비용)으로만 정당화되는 **기준 선택**이다. 신호탐지 틀을 위험 판단에 적용할 때의 실무 지침은 Lynn & Barrett(2014)이 정리. 단, 위 두 분리는 `/attend`의 *현재 구현*이 아니라 *도달 목표*다 — 현 SKILL.md 본문은 "fail-closed"와 "false negative"만 비형식적으로 차용할 뿐 민감도(d′)·기준의 분리도 ROC도 구현하지 않는다(상세·교정: `docs/analysis/prosoche-signal-detection-grounding.md`).

**설계 함의**: 모든 고위험 게이트를 2×2(hit / miss / false alarm / correct reject)로 형식화하고 `base_rate`, `miss_cost`, `false_alarm_cost`, `criterion_reason`을 요구. 이는 저기저율 위험의 과잉게이팅과 고비용 miss의 과소게이팅을 동시에 방지한다.

---

## §Project-wide: 인지부하

프로젝트의 "Plain emit discipline"과 "Round-local salience bundling"은 인지심리학적으로 **외재적 부하(extraneous load) 감소**와 **분할주의(split-attention) 통제**로 정확히 근거화된다(Sweller 1988; Chandler & Sweller 1991; Sweller & Chandler 1994). 작업기억 용량의 유한성(Miller 1956의 7±2; 보다 보수적으로 Cowan 2001의 ~4 청크)이 이 모든 emit 규율의 바탕이다.

미해결 문제는 **게이트 연쇄의 누적 부하**다(프로젝트가 `compose`에서 "not yet formally modeled"로 인정). 각 게이트는 선택지·맥락 갱신 비용·미해결 의무를 누적시킨다. 관련 문헌으로 선택과부하(Iyengar & Lepper 2000)와 결정피로(Vohs et al. 2008)가 있으나, **둘 다 신중히 다뤄야 한다** — 선택과부하는 보편이 아니라 조건부이고(메타분석 평균효과 ≈ 0, Scheibehenne, Greifeneder & Todd 2010), 결정피로의 ego-depletion 자원 모델은 다수연구실 사전등록 재현에서 효과가 확인되지 않았다(Hagger et al. 2016).

**설계 함의**: `GateLoadBudget` — 미해결 결정 수 / 게이트당 대안 수 / 맥락 전환 / 기억 이월을 카운트하고, 예산 초과 시 질문 묶기·저위험 기본값·게이트 통합. 단 선택과부하·결정피로는 정량 법칙이 아니라 **설계 경고**("게이트 누적 부담 리스크")로만 인용할 것.

---

## §Stage 1: 나머지 프로토콜 메커니즘 매핑

심화 대상 외 프로토콜의 작동 메커니즘 1차 매핑. 각 항목은 후속 심화의 출발점이다.

| 프로토콜 | 작동 메커니즘 | 핵심 문헌 |
|---|---|---|
| Euporia (`/elicit`) | 선호는 미리 존재하지 않고 도출 시점에 **구성**된다; 결정전략은 맥락에 적응한다 | Slovic 1995; Payne/Bettman/Johnson 1993; Tversky & Kahneman 1981 |
| Prothesis (`/frame`) | 추론은 본래 **논증적**(타인 설득·평가용)이며, 소수의견은 발산적 사고를 촉진한다 → 다중에이전트 심의 토폴로지의 근거 | Mercier & Sperber 2011; Nemeth 1986 |
| Periagoge (`/induce`) | 개념 형성은 사례→가설 검증(concept attainment)이며 범주는 원형 구조와 이론적 정합성을 가진다 | Bruner/Goodnow/Austin 1956; Rosch 1975; Murphy & Medin 1985 |
| Epharmoge (`/contextualize`) | 지식은 사용 맥락과 분리되지 않는다 — 기술적으로 옳아도 상황에 맞지 않으면 적용 실패 | Brown/Collins/Duguid 1989; Suchman 1987; Lave & Wenger 1991 |
| Elenchus (`/sublate`) | 맥락은 확증편향·신념고착으로 부패한다; 반대설명 생성이 교정한다 | Nickerson 1998; Anderson/Lepper/Ross 1980; Lord/Lepper/Preston 1984 |
| Horismos (`/bound`) | 협업은 **공통기반**을 점증 구축하며 누가 무엇을 아는지는 **분산기억**으로 분담된다 → 무엇을 알고/무엇을 AI가 알아낼지의 경계 근거 | Clark & Brennan 1991; Wegner 1987; Cannon-Bowers/Salas/Converse 1993 |
| Anamnesis (`/recollect`) | 재인은 **부호화 특수성** — 인출단서가 부호화 맥락과 겹칠 때 회상이 성립 (현상학적 근거는 cross-ref) | Tulving & Thomson 1973 + `docs/philosophical-anchors.md` §Anamnesis |
| Katalepsis (`/grasp`) | 생성·인출연습·사전시험이 수동 수용보다 이해를 강화 (이미 근거화됨) | cross-ref `docs/philosophical-anchors.md` §Katalepsis |

---

## Citations

서지 정보는 APA 형식. 정전(canonical) 항목의 권/페이지는 확립된 출처에서 가져왔으며, 일부 세부는 학습지식에서 재구성했다(아래 "검증 상태" 참조).

**Aitesis**
- Searle, J. R. (1969). *Speech Acts: An Essay in the Philosophy of Language*. Cambridge University Press.
- Grice, H. P. (1975). Logic and conversation. In P. Cole & J. Morgan (Eds.), *Syntax and Semantics, Vol. 3: Speech Acts* (pp. 41-58). Academic Press.
- Loewenstein, G. (1994). The psychology of curiosity: A review and reinterpretation. *Psychological Bulletin*, 116(1), 75-98.
- Miyake, N., & Norman, D. A. (1979). To ask a question, one must know enough to know what is not known. *Journal of Verbal Learning and Verbal Behavior*, 18(3), 357-364.
- Nelson, J. D. (2005). Finding useful questions: On Bayesian diagnosticity, probability, impact, and information gain. *Psychological Review*, 112(4), 979-999.
- Clark, H. H., & Schaefer, E. F. (1989). Contributing to discourse. *Cognitive Science*, 13(2), 259-294.
- Mohanani, R., Salman, I., Turhan, B., Rodríguez, P., & Ralph, P. (2020). Cognitive biases in software engineering: A systematic mapping study. *IEEE Transactions on Software Engineering*, 46(12), 1318-1339.

**Syneidesis**
- Mitchell, D. J., Russo, J. E., & Pennington, N. (1989). Back to the future: Temporal perspective in the explanation of events. *Journal of Behavioral Decision Making*, 2(1), 25-38.
- Klein, G. (2007). Performing a project premortem. *Harvard Business Review*, 85(9), 18-19.
- Pronovost, P., et al. (2006). An intervention to decrease catheter-related bloodstream infections in the ICU. *New England Journal of Medicine*, 355(26), 2725-2732.
- Haynes, A. B., et al. (2009). A surgical safety checklist to reduce morbidity and mortality in a global population. *New England Journal of Medicine*, 360(5), 491-499.
- Lord, C. G., Lepper, M. R., & Preston, E. (1984). Considering the opposite: A corrective strategy for social judgment. *Journal of Personality and Social Psychology*, 47(6), 1231-1243.
- Ritov, I., & Baron, J. (1990). Reluctance to vaccinate: Omission bias and ambiguity. *Journal of Behavioral Decision Making*, 3(4), 263-277.

**Analogia**
- Gentner, D. (1983). Structure-mapping: A theoretical framework for analogy. *Cognitive Science*, 7(2), 155-170.
- Gick, M. L., & Holyoak, K. J. (1980). Analogical problem solving. *Cognitive Psychology*, 12(3), 306-355.
- Gick, M. L., & Holyoak, K. J. (1983). Schema induction and analogical transfer. *Cognitive Psychology*, 15(1), 1-38.
- Holyoak, K. J., & Koh, K. (1987). Surface and structural similarity in analogical transfer. *Memory & Cognition*, 15(4), 332-340.
- Gentner, D., Rattermann, M. J., & Forbus, K. D. (1993). The roles of similarity in transfer: Separating retrievability from inferential soundness. *Cognitive Psychology*, 25(4), 524-575.
- Gentner, D., Loewenstein, J., & Thompson, L. (2003). Learning and transfer: A general role for analogical encoding. *Journal of Educational Psychology*, 95(2), 393-408.

**Prosoche**
- Green, D. M., & Swets, J. A. (1966). *Signal Detection Theory and Psychophysics*. Wiley.
- Meehl, P. E., & Rosen, A. (1955). Antecedent probability and the efficiency of psychometric signs, patterns, or cutting scores. *Psychological Bulletin*, 52(3), 194-216.
- Kahneman, D., & Tversky, A. (1973). On the psychology of prediction. *Psychological Review*, 80(4), 237-251.
- Lynn, S. K., & Barrett, L. F. (2014). "Utilizing" signal detection theory. *Psychological Science*, 25(9), 1663-1673.

**Project-wide: 인지부하**
- Miller, G. A. (1956). The magical number seven, plus or minus two: Some limits on our capacity for processing information. *Psychological Review*, 63(2), 81-97.
- Cowan, N. (2001). The magical number 4 in short-term memory: A reconsideration of mental storage capacity. *Behavioral and Brain Sciences*, 24(1), 87-114.
- Sweller, J. (1988). Cognitive load during problem solving: Effects on learning. *Cognitive Science*, 12(2), 257-285.
- Chandler, P., & Sweller, J. (1991). Cognitive load theory and the format of instruction. *Cognition and Instruction*, 8(4), 293-332.
- Sweller, J., & Chandler, P. (1994). Why some material is difficult to learn. *Cognition and Instruction*, 12(3), 185-233.
- Iyengar, S. S., & Lepper, M. R. (2000). When choice is demotivating: Can one desire too much of a good thing? *Journal of Personality and Social Psychology*, 79(6), 995-1006.
- Scheibehenne, B., Greifeneder, R., & Todd, P. M. (2010). Can there ever be too many options? A meta-analytic review of choice overload. *Journal of Consumer Research*, 37(3), 409-425.
- Vohs, K. D., et al. (2008). Making choices impairs subsequent self-control: A limited-resource account of decision making, self-regulation, and active initiative. *Journal of Personality and Social Psychology*, 94(5), 883-898.
- Hagger, M. S., et al. (2016). A multilab preregistered replication of the ego-depletion effect. *Perspectives on Psychological Science*, 11(4), 546-573.

**Stage 1 (나머지 프로토콜)**
- Slovic, P. (1995). The construction of preference. *American Psychologist*, 50(5), 364-371.
- Payne, J. W., Bettman, J. R., & Johnson, E. J. (1993). *The Adaptive Decision Maker*. Cambridge University Press.
- Tversky, A., & Kahneman, D. (1981). The framing of decisions and the psychology of choice. *Science*, 211(4481), 453-458.
- Mercier, H., & Sperber, D. (2011). Why do humans reason? Arguments for an argumentative theory. *Behavioral and Brain Sciences*, 34(2), 57-74.
- Nemeth, C. J. (1986). Differential contributions of majority and minority influence. *Psychological Review*, 93(1), 23-32.
- Bruner, J. S., Goodnow, J. J., & Austin, G. A. (1956). *A Study of Thinking*. Wiley.
- Rosch, E. (1975). Cognitive representations of semantic categories. *Journal of Experimental Psychology: General*, 104(3), 192-233.
- Murphy, G. L., & Medin, D. L. (1985). The role of theories in conceptual coherence. *Psychological Review*, 92(3), 289-316.
- Brown, J. S., Collins, A., & Duguid, P. (1989). Situated cognition and the culture of learning. *Educational Researcher*, 18(1), 32-42.
- Suchman, L. A. (1987). *Plans and Situated Actions: The Problem of Human-Machine Communication*. Cambridge University Press.
- Lave, J., & Wenger, E. (1991). *Situated Learning: Legitimate Peripheral Participation*. Cambridge University Press.
- Nickerson, R. S. (1998). Confirmation bias: A ubiquitous phenomenon in many guises. *Review of General Psychology*, 2(2), 175-220.
- Anderson, C. A., Lepper, M. R., & Ross, L. (1980). Perseverance of social theories. *Journal of Personality and Social Psychology*, 39(6), 1037-1049.
- Clark, H. H., & Brennan, S. E. (1991). Grounding in communication. In L. B. Resnick et al. (Eds.), *Perspectives on Socially Shared Cognition* (pp. 127-149). APA.
- Wegner, D. M. (1987). Transactive memory: A contemporary analysis of the group mind. In B. Mullen & G. R. Goethals (Eds.), *Theories of Group Behavior* (pp. 185-208). Springer.
- Cannon-Bowers, J. A., Salas, E., & Converse, S. (1993). Shared mental models in expert team decision making. In N. J. Castellan (Ed.), *Individual and Group Decision Making* (pp. 221-246). Erlbaum.
- Tulving, E., & Thomson, D. M. (1973). Encoding specificity and retrieval processes in episodic memory. *Psychological Review*, 80(5), 352-373.

## 검증 상태 및 잔여 불확실성

본 매핑은 Codex(`/goal`) + Tavily 외부 검증 세션으로 도출했다. **검증 강도**:

- **외부 확인됨**(Verified): Aitesis, Analogia, Syneidesis, Prosoche, Epharmoge, Elenchus, Horismos, 인지부하 핵심 문헌, Tulving & Thomson — 이번 실행에서 소스를 외부 확인.
- **부분 확인**(Mostly): Euporia, Prothesis, Periagoge, Katalepsis — 핵심만 외부 확인, 일부는 학습지식 종합.
- **재구성 주의**: 일부 서지의 권/호/페이지는 학습지식에서 재구성했다. **출판/공개 전 정전 항목의 정확한 pagination을 1차 출처로 spot-check 권장.**

**가장 약한 근거**: 결정피로(decision fatigue). Vohs et al.(2008) 원 결과는 관련 있으나 ego-depletion 자원 모델은 Hagger et al.(2016) 다수연구실 재현에서 확인되지 않았다. 선택과부하도 조건부(Scheibehenne et al. 2010 메타분석 평균효과 ≈ 0). → 이 둘은 정량 법칙이 아니라 설계 경고로만 사용.

## Cross-references

- `references/README.md` (Layer 2 도메인 참조 인덱스; 이 문서의 부모)
- `docs/philosophical-anchors.md` (Anamnesis Husserl 현상학, Katalepsis Stoic grasp + 학습과학; 본 문서와 상보)
- `aitesis/skills/inquire/SKILL.md`, `syneidesis/skills/gap/SKILL.md`, `analogia/skills/ground/SKILL.md`, `prosoche/skills/attend/SKILL.md` (심화 대상 프로토콜)
- `epistemic-cooperative/skills/compose/SKILL.md` (게이트 연쇄 누적 부하 — 인지부하 §의 미해결 문제와 연결)

## Note on Layer-2 purity

이 문서는 도메인 이론 수준의 **설계 근거**를 담는다. 프로토콜 SKILL.md에 새 실행 규칙을 주입하지 않는다. "설계 함의"로 표시된 제안(QuestionAct, PremortemPass, MappingLedger, 2×2 위험표, GateLoadBudget)은 *문헌이 함의하는 설계 방향*이지, 채택된 사양이 아니다 — 실제 SKILL.md 반영 여부는 별도 설계 결정이다.
