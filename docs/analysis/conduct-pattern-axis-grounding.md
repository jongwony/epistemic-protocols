# Conduct 7패턴 → 5축 Grounding

> 이 문서는 `docs/analysis/conduct-grounding-spec.md`의 7가지 dynamic-workflow 패턴을
> conduct의 5축(order·independence·reconciliation·termination·routing)에 매핑하고,
> 교차학문적 인용 계보, 독립 교차추론자(codex, GPT 계열) 검증, 교차 런타임
> 이식성 시험의 결과를 기록한다.

---

## 결론

7가지 workflow 패턴은 cited 교차학문 계보와 함께 conduct의 5축에 매핑된다.
독립 GPT-계열 교차추론자(codex)가 7패턴 중 5개를 확인하고 2개를 교정했다:
P5는 order → **routing**(경로 다양성), P7은 routing → **cross-cutting** disclosure overlay로
재분류됐다. 결과적으로 order 축은 1차 패턴이 없는 무대 기저(substrate)이고,
cross-cutting overlay가 전 축에 걸치는 독립 차원이다. 패턴들은 FUNCTION에서는
불변이나 REALIZATION에서는 우연적이다. 이 평평한 검증 매핑이 canonical하며(matter-근접),
추상화(abstraction)는 비규범 메타설계 노트에만 위치한다.

---

## 1. 프레임 근거 — Extended Mind

5축 좌표계는 Extended Mind 프레임 위에서 읽힌다: 에이전트의 인식론적 인지는
모델 경계에 갇히지 않고 Harness 세션의 확장 표면(extension surfaces)과 결합된다.

**order · independence · reconciliation · termination · routing** 은
그 좌표계의 5개 축이다.

인용: Clark, A. & Chalmers, D. (1998). "The Extended Mind." *Analysis* 58(1):7–19.
Active externalism과 parity principle — 두개골 외부 도구가 인지 과정의 일부가 될 수 있음.
프로젝트 내부 앵커: `docs/philosophical-anchors.md` §A2 (active externalism),
§A5 (확장 작업공간 유한용량).

---

## 2. 매핑 — 7패턴 → conduct 5축

| conduct 축 | 1차 패턴 | 근거 인용 |
|-----------|----------|----------|
| **order** | *(없음 — 발견 사항)* | order는 패턴들이 그 위에서 실행되는 무대 기저. 어떤 패턴도 order를 1차 전략 목표로 삼지 않음. codex 교차검증 확인. |
| **independence** | **P2 Perspective-Diverse Verify** | Denzin 1978 (methodological triangulation); Campbell & Fiske 1959 (MTMM); Chain-of-Verification / CoVe (Dhuliawala et al., arXiv:2309.11495); Self-Consistency (Wang et al., arXiv:2203.11171); Faceted search (Dumais 2009) |
| **reconciliation** (eliminative) | **P1 Adversarial Verify** | Mellers, Hertwig & Kahneman 2001 (adversarial collaboration); Popper/Platt 반증주의; AI Safety via Debate (Irving et al., arXiv:1805.00899); Multiagent Debate (Du et al., arXiv:2305.14325); DebateCV "Debating Truth" (arXiv:2507.19090, WWW 2026); N-Version Programming (Avizienis 1985, IEEE TSE) |
| **reconciliation** (integrative) | **P3 Judge Panel** | Dialectical inquiry / devil's advocacy (Schwenk 1990 meta-analysis; Schweiger et al. 1989); Mixture-of-Agents (Wang et al., arXiv:2406.04692); Replacing Judges with Juries / PoLL (Verga et al., arXiv:2404.18796); MT-Bench / LLM-as-judge (Zheng et al., arXiv:2306.05685) |
| **termination** (stop rule) | **P4 Loop-until-dry** | Theoretical saturation, grounded theory (Glaser & Strauss 1967); Francis et al. 2009/2010 (K-consecutive stopping criterion); Reflexion (Shinn et al., arXiv:2303.11366); Self-Refine (Madaan et al., arXiv:2303.17651) |
| **termination** (stop gate) | **P6 Completeness Critic** | Metacognition (Flavell 1979; Nelson & Narens 1990); Gawande, *The Checklist Manifesto* (2009); CoVe (arXiv:2309.11495); DeepSearchQA: Bridging the Comprehensiveness Gap for Deep Research Agents (Google, arXiv:2601.20975); Enterprise Deep Research (Salesforce, arXiv:2510.17797) |
| **routing** | **P5 Multi-modal Sweep** | 동일 목표를 다른 경로(by-document, by-keyword, by-entity, by-time, by-source)로 탐색; FedSearch / federated retrieval (Callan 2002); 분산 정보 검색 (Shokouhi & Si 2011 survey); RAG routing / semantic dispatch (Lewis et al. arXiv:2005.11401) |
| **cross-cutting overlay** (전 축) | **P7 No silent caps** | PRISMA/CONSORT/STROBE 보고 투명성 지침 (Moher et al. 2009; Page et al. 2021; Schulz et al. 2010; von Elm et al. 2007); Ioannidis 2024 (transparency meta-research); Kadavath et al. 2022 "Language Models (Mostly) Know What They Know" (arXiv:2207.05221); Selective prediction (El-Yaniv 2010); W3C PROV / data lineage |

**P5 Multi-modal Sweep 교정 기록**: 집필 세션 초기 분류 order → codex 교정 후 **routing**으로 재분류.
경로 다양성(여러 탐색 경로 병렬 실행)이 차별자이며, 병렬 순서가 아님.
이에 따라 P5 1차 축 = routing.

---

## 3. 출처 무결성 보정

**업계 앵커**: Claude Code `Workflow` 도구의 "Quality patterns" 절이 집필 세션에 1차
관찰로 주입됐으며, 7패턴 이름이 축자 일치(primary source).

**공개 재도출 가능 개념 조상**: Anthropic "Building Effective Agents" (2024)
https://www.anthropic.com/research/building-effective-agents —
parallelization(sectioning/voting), evaluator-optimizer, orchestrator-workers 명명(개명된 계보).
패턴들의 independent conceptual lineage는 이 문서에서 각 패턴별로 분리 인용됐다.

**404 검증**: `code.claude.com/docs/en/workflows` → 404 확인(부재 검증). **인용 불가**.

**arXiv:2601.20975 정식 제목**: "DeepSearchQA: Bridging the Comprehensiveness Gap for Deep
Research Agents" — 제목 표기에 이 전체 제목을 사용할 것; 약칭만 사용 금지.

---

## 4. 교차추론자 검증 — codex (GPT 계열)

codex가 블라인드 독립 재매핑을 수행했고, 결과는 다음과 같다.

**5/7 삼중 수렴** (cog-sci ⊕ ML ⊕ 업계, Claude ⊕ GPT):
- P1 → reconciliation(eliminative): 일치
- P2 → independence: 일치
- P3 → reconciliation(integrative): 일치
- P4 → termination(stop rule): 일치
- P6 → termination(stop gate): 일치

**codex 교정 2건**:

1. **P5 교정**: order → **routing** — "경로 다양성이 차별자, 병렬 순서가 아님."
   동일 목표를 이질적 탐색 경로로 라우팅하는 것이 P5의 독립 기여.

2. **P7 교정**: routing → **cross-cutting** disclosure overlay —
   "P7은 특정 축 위에 위치하지 않고 전 축에 걸친다."
   투명성 의무는 모든 축의 실행에 적용되는 2차 규율.

**결론**: order 축 1차 패턴 없음 — order는 패턴들이 위에서 도는 무대 기저.
P7은 축 위가 아니라 cross-cutting overlay로 의미상 상위에 위치.

---

## 5. 교차 런타임 이식성

codex가 자기 런타임 preflight binding ledger를 산출했다:

| 항목 | 바인딩 결과 | 비고 |
|------|------------|------|
| C1 (자율 다중소스 리서치) | **clean** | Tavily MCP (`tavily_research`) |
| C2 (단일 쿼리 팩트 조회) | **clean** | Tavily MCP (`tavily_search`) |
| C3 (교차모델계열 추론자) | **DEGRADATION** | 비-GPT 추론자 codex 런타임에서 도달 불가 |
| M-inquire | **clean** | Aitesis (`/inquire`) skill 직접 바인딩 |
| M-sublate | **partial** | Elenchus (`/sublate`) — partial 사유 본 문서 미상술 |
| M-ground | **partial** | Analogia (`/ground`) — partial 사유 본 문서 미상술 |
| M-frame | **partial** | Prothesis (`/frame`) — 동일 GPT 계열 |

**전체 판정: PARTIAL** (C3 = 유일한 DEGRADATION).

스펙의 "surface a degradation, never silent" 규율이 런타임 경계를 넘어 작동함을 확인.

**비대칭 통찰**: C3("다른 모델 계열")는 유일한 런타임-상대적 좌표다.
바인딩 가능성이 비대칭 — Claude 런타임은 codex로 C3 바인딩,
codex 런타임은 C3 degrade. 동일 스펙이 런타임별로 다른 degradation 지형을 가짐.

---

## 6. 메타설계 노트

> **비규범 — 이 섹션 전체는 설계 노트이며 규범 분류가 아님.**

### Function vs Realization (codex 기여)

모든 패턴 = 불변 function + 우연한 realization.

불변성 시험 = 같은 *구조적 제약*이 재발하는가:
유한 탐색 · 복수 기준 · 출처 이질성 · 오염 위험 · 불확실 정지.
단순 분야 간 재발(문화적 차용 교란)이 아님.

따라서:
- P1(반증 압력)의 function = 불변; 3검증자 다수결 레시피 = 현 모델 우연.
- P3(선택 전 경쟁 가치함수 보존)의 function = 불변; 변동 평균화 레시피 = 현 모델 우연.
- P7의 cross-cutting trace/disclosure = 불변자; 의미상 축 위.

**모델 개선 "궤적" 태그는 추측을 화석화하므로 이 문서에 넣지 않는다.**

### 평평 매핑의 canonical 지위

평평한 검증 매핑이 canonical(matter-근접)이고 추상은 비규범 노트인 이유:
form(temperament·생성질문)은 구체 matter를 *오직* preflight binding ledger
(런타임별·세션 시작) + 실제 실행에서만 드러낸다.
degradation surface = 정직해진 matter-revelation.
그래서 추상 축-재framing(아래 후보 정련)은 미채택이며, 평평 매핑이 SKILL.md-호환 기준.

### 후보 미래 정련 (제시만, 미채택)

codex의 5 생성질문 — 5축을 질문으로 재framing하고 disclosure(P7)를 1급 질문으로 승격:

1. **Sequence graph**: 어떤 moves를 어떤 순서와 형태로 실행하는가?
2. **State boundary**: 어떤 맥락이 단계 사이를 건너가는가?
3. **Adjudication**: 복수 결과를 어떻게 처리하는가(비교·반박·병합·선택)?
4. **Control policy**: 루프를 언제 정지·반복·에스컬레이트·체크포인트하는가?
5. **Trace contract**: 어떤 한계·degradation·누락을 공개하는가?

이 재framing은 평평 매핑과 모순되지 않으며, lift 시점 기준은 다음과 같다:

- **너무 이른 lift**: 일회성 빈-축 불편, 다운스트림 conduct 계획을 바꾸지 않는 차원 제안,
  운영 결과 없는 태그 논쟁.
- **너무 늦은 lift**: 독립적 conduct 사용들에서 새 차원 반복, 동일 미매핑 압력 재발,
  리뷰어가 패턴이 sequence/state/adjudication/control/trace 중 무엇을 바꾸는지 결정 불가,
  평평 매핑이 SKILL.md 비호환 편집을 유발하는 시점.

---

## Source Notes

### 프로젝트 내부 근거

- `docs/analysis/conduct-grounding-spec.md` — 7패턴 정의, 5축 정의, conduct topology,
  preflight binding ledger, degradation 규율. 이 문서의 1차 소스.
- `docs/philosophical-anchors.md` §A2 (active externalism), §A5 (확장 작업공간 유한용량) —
  Extended Mind 프레임의 프로젝트 내부 앵커.
- `docs/analysis/mattpocock-skills-extended-mind-grounding.md` — Extended Mind 좌표 프레임
  설계 선례; relay/constitution boundary, Epistemic Cost Topology.
- `hyphegesis/skills/conduct/SKILL.md` — conduct 프로토콜 SKILL.md; 5축 정의 및
  TOOL GROUNDING 런타임 계약.

### 외부 근거

**철학 / 인지과학**
- Clark, A. & Chalmers, D. (1998). The Extended Mind. *Analysis*, 58(1):7–19.
  Active externalism, parity principle. https://www.jstor.org/stable/3328150
- Flavell, J.H. (1979). Metacognition and cognitive monitoring. *American Psychologist*, 34(10):906–911.
- Nelson, T.O. & Narens, L. (1990). Metamemory: A theoretical framework and new findings.
  *Psychology of Learning and Motivation*, 26:125–173.
- Denzin, N.K. (1978). *The Research Act: A Theoretical Introduction to Sociological Methods*. 2nd ed. McGraw-Hill.
  Methodological triangulation.
- Campbell, D.T. & Fiske, D.W. (1959). Convergent and discriminant validation by the multitrait-multimethod matrix.
  *Psychological Bulletin*, 56(2):81–105. (MTMM)
- Glaser, B.G. & Strauss, A.L. (1967). *The Discovery of Grounded Theory*. Aldine.
  Theoretical saturation.
- Francis, J.J. et al. (2010). What is an adequate sample size? Operationalising data saturation for
  theory-based interview studies. *Psychology & Health*, 25(10):1229–1245. (online-first 2009)
  K-consecutive stopping criterion.
- Mellers, B., Hertwig, R. & Kahneman, D. (2001). Do frequency representations eliminate conjunction effects?
  An exercise in adversarial collaboration. *Psychological Science*, 12(4):269–275.
- Popper, K.R. (1959). *The Logic of Scientific Discovery*. London: Hutchinson.
  (반증주의 / falsificationism; orig. *Logik der Forschung*, 1934)
- Platt, J.R. (1964). Strong inference. *Science*, 146(3642):347–353.
  (강한 추론 — 가설 반증을 통한 체계적 제거)
- Schwenk, C.R. (1990). Effects of devil's advocacy and dialectical inquiry on decision making:
  A meta-analysis. *Organizational Behavior and Human Decision Processes*, 47(1):161–176.
- Schweiger, D.M., Sandberg, W.R., & Rechner, P.L. (1989). Experiential effects of dialectical
  inquiry, devil's advocacy, and consensus approaches to strategic decision making.
  *Academy of Management Journal*, 32(4):745–772.
- Ioannidis, J.P.A. (2024). Meta-research: The art of getting it wrong. *Research Synthesis Methods*, 15(1):6–19.
  Transparency meta-research.
- El-Yaniv, R. (2010). On the foundations of noise-free selective classification. *JMLR*, 11:1605–1641.
  Selective prediction.
- Gawande, A. (2009). *The Checklist Manifesto: How to Get Things Right*. Metropolitan Books.
- Avizienis, A. (1985). The N-version approach to fault-tolerant software.
  *IEEE Transactions on Software Engineering*, 11(12):1491–1501.
- Dumais, S.T. (2009). Faceted search. In *Encyclopedia of Database Systems*. Springer.
- Callan, J. (2002). Distributed information retrieval. In *Advances in Information Retrieval*. Springer.
- Shokouhi, M. & Si, L. (2011). Federated search. *Foundations and Trends in Information Retrieval*, 5(1):1–102.
- Moher, D. et al. (2009). Preferred reporting items for systematic reviews and meta-analyses:
  The PRISMA statement. *PLOS Medicine*, 6(7):e1000097. (PRISMA 2009)
- Page, M.J. et al. (2021). The PRISMA 2020 statement: An updated guideline for reporting
  systematic reviews. *BMJ*, 372:n71. (PRISMA 2020)
- Schulz, K.F., Altman, D.G. & Moher, D. (2010). CONSORT 2010 Statement: Updated guidelines for
  reporting parallel group randomised trials. *BMJ*, 340:c332. (CONSORT 2010)
- von Elm, E. et al. (2007). The Strengthening the Reporting of Observational Studies in
  Epidemiology (STROBE) statement. *Lancet*, 370(9596):1453–1457. (STROBE 2007)

**ML / AI**
- Dhuliawala, S. et al. (2023). Chain-of-Verification Reduces Hallucination in Large Language Models.
  arXiv:2309.11495. https://arxiv.org/abs/2309.11495 (CoVe)
- Wang, X. et al. (2022). Self-Consistency Improves Chain of Thought Reasoning in Language Models.
  arXiv:2203.11171. https://arxiv.org/abs/2203.11171
- Irving, G. et al. (2018). AI Safety via Debate. arXiv:1805.00899. https://arxiv.org/abs/1805.00899
- Du, Y. et al. (2023). Improving Factuality and Reasoning in Language Models through Multiagent Debate.
  arXiv:2305.14325. https://arxiv.org/abs/2305.14325
- Wang, J. et al. (2024). Mixture-of-Agents Enhances Large Language Model Capabilities.
  arXiv:2406.04692. https://arxiv.org/abs/2406.04692
- Verga, P. et al. (2024). Replacing Judges with Juries: Evaluating LLM Generations with a Panel of
  Diverse Models. arXiv:2404.18796. https://arxiv.org/abs/2404.18796 (PoLL)
- Zheng, L. et al. (2023). Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena.
  arXiv:2306.05685. https://arxiv.org/abs/2306.05685
- Shinn, N. et al. (2023). Reflexion: Language Agents with Verbal Reinforcement Learning.
  arXiv:2303.11366. https://arxiv.org/abs/2303.11366
- Madaan, A. et al. (2023). Self-Refine: Iterative Refinement with Self-Feedback.
  arXiv:2303.17651. https://arxiv.org/abs/2303.17651
- Kadavath, S. et al. (2022). Language Models (Mostly) Know What They Know.
  arXiv:2207.05221. https://arxiv.org/abs/2207.05221
- Lewis, P. et al. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks.
  arXiv:2005.11401. https://arxiv.org/abs/2005.11401 (RAG routing / semantic dispatch)
- Google DeepMind. DeepSearchQA: Bridging the Comprehensiveness Gap for Deep Research Agents.
  arXiv:2601.20975. https://arxiv.org/abs/2601.20975
- Prabhakar, A. et al. (2025). Enterprise Deep Research: Steerable Multi-Agent Deep Research for
  Enterprise Analytics. arXiv:2510.17797. https://arxiv.org/abs/2510.17797 (Salesforce AI Research)
- He, H. et al. (2026). Debating Truth: Debate-driven Claim Verification with Multiple Large Language
  Model Agents. arXiv:2507.19090. https://arxiv.org/abs/2507.19090 (DebateCV; WWW 2026)

**업계 / 표준**
- Anthropic. Building Effective Agents. (2024).
  https://www.anthropic.com/research/building-effective-agents
  Parallelization(sectioning/voting), evaluator-optimizer, orchestrator-workers 계보.
- W3C PROV. https://www.w3.org/TR/prov-overview/ (Data lineage / provenance)
- `code.claude.com/docs/en/workflows` — **404 확인, 인용 불가.** 이 URL을 출처로 사용하지 말 것.
