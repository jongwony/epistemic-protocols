# Analogia 인지심리학적 기반: 구조매핑이론(Structure-Mapping)과 설계 충실도

> 이 문서는 Analogia(`/ground`) 프로토콜의 인지심리학적 기반을 심층 검증한다.
> Core Principle("Structural Correspondence over Abstract Assertion", SKILL.md L130)의
> 학술적 뿌리인 Gentner의 구조매핑이론과 유추전이 연구의 진위를 1차 출처로 확인하고,
> 각 이론과 프로토콜 설계 간 매핑의 **구조적 충실도**를 분석한다.
> `references/cognitive-psychology.md` §Analogia가 1줄 인덱스라면, 이 문서는 그 심층 층이며
> 개선 이슈 #480(MappingLedger)의 근거 기반이다.

---

## 배경: "이 추상이 내 도메인에 적용되는가?"의 인지적 구조

Analogia는 추상 프레임워크(Sₐ)가 사용자의 구체 도메인(Sₜ)에 실제로 들어맞는지를, 단언이 아니라 구조적 대응의 검증으로 다룬다. 이 문제는 인지심리학에서 **유추전이(analogical transfer)**로 50년간 연구되어 왔고, 그 핵심 결론은 하나로 수렴한다:

> 유추는 **객체의 속성**이 아니라 **객체 간 관계**, 특히 **고차 관계(higher-order relations)**가 보존될 때 타당하게 전이된다.

이 결론은 Analogia의 설계 정당성을 직접 떠받친다 — "추상이 적용된다"는 표면적 유사성 판단(surface similarity)은 잘못된 전이를 낳고, 관계 구조의 보존(structural similarity)만이 타당한 적용을 보장하기 때문이다. 따라서 Analogia가 검증해야 할 것은 "비슷해 보이는가"가 아니라 "관계 구조가 보존되는가"이며, 이 구분이 프로토콜의 존재 이유다.

---

## 학술 참조 검증

각 참조의 진위를 1차 출처로 확인하고 핵심 발견·방법·효과·경계조건을 기록한다.

### Gentner, D. (1983). Structure-Mapping: A theoretical framework for analogy. *Cognitive Science*, 7(2), 155-170. — ✅ 검증(PDF 본문 직접 추출)

- **출처**: https://groups.psych.northwestern.edu/gentner/papers/Gentner83.2b.pdf (저자 제공 PDF)
- **핵심 발견**(본문 인용): *"analogy is characterized by the mapping of relations between objects, rather than attributes of objects, from base to target; and, further, that the particular relations mapped are those that are dominated by higher-order relations that belong to the mapping (the systematicity claim)."*
- **systematicity 원리**: 사람은 "the deepest, most interconnected mappable system"을 선호한다. 여러 관계가 충돌할 때, 고차 관계(CAUSE, IMPLIES 등)가 묶어주는 체계에 속한 관계가 우선 매핑된다. (예: 중심력 유추에서 `MORE MASSIVE THAN`은 보존되고 `HOTTER THAN`은 버려지는 이유 — 전자만 중심력 체계에 참여)
- **이론적 성격**: 매핑 규칙은 "syntactic properties of the knowledge representation"에만 의존하고 도메인 내용에 독립적 — 이로써 유추를 literal similarity, abstraction과 형식적으로 구분 가능.
- **경계조건**: 표상 의존적 — 입력 지식 표상이 관계를 명시하지 않으면 systematicity가 작동할 표면이 없다.

### Gick, M. L., & Holyoak, K. J. (1980; 1983). Analogical problem solving / Schema induction and analogical transfer. *Cognitive Psychology*. — ⚠️ 정전 인용(본 문서에서 PDF 직접 추출 안 함; Gentner 1983 본문이 인용)

- **핵심 발견**(정전 지식): radiation 문제와 fortress/general 유추를 이용한 전이 패러다임의 원형. 자발적 전이는 낮고(힌트 없으면 소수만 source를 활용), 명시적 힌트나 다중 사례로 스키마가 유도되면 전이가 크게 상승.
- **본 문서 한계**: 효과크기는 1차 출처로 재확인하지 않았다 — 인용 시 "정전, 효과크기 미재확인"으로 표기 권장.

### Holyoak, K. J., & Koh, K. (1987). Surface and structural similarity in analogical transfer. *Memory & Cognition*, 15(4), 332-340. — ✅ 검증(PubMed + 다수 인용 교차확인)

- **출처**: PubMed 3670053 (https://pubmed.ncbi.nlm.nih.gov/3670053); 다수 후속 논문이 방법·결론을 인용.
- **방법**: radiation 문제와 source 유추 문제 사이의 **구조적 중첩**과 **표면적 중첩**을 독립 조작.
- **핵심 발견**: 표면 유사성은 source의 **자발적 인출(retrieval/접근)**을 좌우하고, 구조 유사성은 **전이의 성공(적용)**을 좌우한다 — 두 유사성이 서로 다른 단계에 작용한다. 즉 표면이 비슷하면 떠올리지만, 구조가 맞아야 옳게 적용된다.
- **함의**: 표면 유사성은 잘못된 후보를 끌어와 오적용을 유발할 수 있다(retrieval에 좋은 유사성 ≠ inference에 좋은 유사성).

### Gentner, D., Rattermann, M. J., & Forbus, K. D. (1993). The roles of similarity in transfer: Separating retrievability from inferential soundness. *Cognitive Psychology*, 25(4), 524-575. — ⚠️ 정전 인용(GentnerMarkman97 경유; 본 문서 직접 추출 안 함)

- **핵심 발견**(정전 지식): 인출가능성(retrievability)과 추론 건전성(inferential soundness)을 분리. 표면 유사성은 인출을 높이지만 건전한 추론을 보장하지 않는다 — Holyoak & Koh의 결론을 강화하는 후속 증거.

### Gentner, D., Loewenstein, J., & Thompson, L. (2003). Learning and transfer: A general role for analogical encoding. *Journal of Educational Psychology*, 95(2), 393-408. — ✅ 검증(PDF 본문 직접 추출)

- **출처**: https://groups.psych.northwestern.edu/gentner/papers/GentnerLoewensteinThompson03.pdf
- **핵심 발견**(본문 인용): 두 사례를 **비교(comparison)**하면 공통 스키마가 추출되고 전이가 상승. 협상 과제에서 비교 조건 참가자는 **48%**가 원리를 새 사례에 전이, 분리-사례 조건은 **19%** — χ²(1, N=128)=11.85, p<.01 ("over twice as likely"). 우발적-계약(contingent-contract) 원리에서도 비교 38% vs 분리 16%, χ²(1, N=64)=3.92, p<.05.
- **추가 결과**: 스키마 추상화의 질이 좋을수록 전이도 좋다(Exp 2); 비교 과정의 노력/강도가 클수록 전이도 크다(Exp 3); 이득은 가르친 원리에 한정(specific).
- **경계조건**: 비교 조건은 baseline보다 우월했으나 분리-사례 조건은 그렇지 않았다 — **단순 노출이 아니라 비교 행위 자체**가 동인.

---

## 이론 ↔ 프로토콜 매핑 충실도

Analogia의 실제 메커니즘(SKILL.md의 FLOW·TYPES·Phase)을 SMT 이론 요소에 대조한다.

| 이론 요소 (Gentner SMT) | Analogia 구현 (SKILL.md) | 충실도 |
|---|---|---|
| 관계 > 속성 매핑 | Core Principle "Structural Correspondence over Abstract Assertion"(L130); `Correspondence={abstract, concrete, relation}`(L42) | **충실** — 단언이 아닌 명시적 대응 구성, relation 필드 보유 |
| systematicity(고차 관계 우선) | `F={preserved, partial, missing, overextended, open}`(L46); `mappings=confirmed∪dismissed∪remaining`(평탄 집합, L121) | **갭** — 1차 vs 고차 관계 구분 없음; 연결된 인과 체계 선호 메커니즘 부재 |
| 표면 vs 구조 유사성 분리 | `Component={name, structure}`(L43); Phase 1 도메인 분해(L211) | **부분** — structure 필드는 있으나 표면 유사 기반 대응을 *걸러내는* 가드 없음 |
| 후보 추론 / 금지된 추론 | `overextended`("source relation adds unsupported target constraints", L50) | **부분** — 과잉 제약은 잡으나 licensed inference를 명시 산출하지 않음 |
| analogical encoding(2사례 비교) | `Map=(Sₐ, Sₜ)→Set(Correspondence)`(L40); Phase 2 단일 instantiation(L267) | **부재** — 1 source→1 target만; 두 구체 사례 비교로 스키마 추출하는 경로 없음 |

### 분석

**1. 충실한 부분 — 관계 중심 설계.** Analogia의 Core Principle과 `Correspondence` 타입은 Gentner의 "관계 > 속성" 원칙을 정확히 반영한다. "추상이 적용된다"는 단언 대신 명시적 대응(L312, Rule 4)을 구성하고, 모든 대응에 구체 인스턴스를 요구(L313, Rule 5)하는 것은 표면 단언을 구조 검증으로 대체하려는 SMT 정신과 일치한다.

**2. 최대 갭 — systematicity 미구현.** Gentner의 *중심* 예측 변수는 systematicity, 즉 고차 인과 관계가 묶어주는 깊고 연결된 체계의 선호다. 그러나 Analogia의 fit map은 대응을 **평탄 집합**으로 다루고(`mappings = confirmed ∪ dismissed ∪ remaining`, L121), 1차 관계와 고차 관계를 구분하지 않는다. Phase 2 선택 기준(L238)은 "남은 불확실성을 최대로 줄이는 대응"이라는 **정보이득** 휴리스틱이지 systematicity가 아니다. 결과적으로 Analogia는 서로 무관한 표면적 대응 묶음을 모두 "preserved"로 검증하면서도, 그것들이 *연결된 인과 체계*를 이루는지는 확인하지 않을 수 있다. SMT 관점에서 이는 "관계는 맞지만 얕은(systematicity 낮은) 매핑"을 걸러내지 못하는 구멍이다.

**3. 부분 충실 — 표면 유사 가드 부재.** Holyoak & Koh(1987)는 표면 유사성이 잘못된 후보를 끌어와 오적용을 부른다고 보였다. Analogia는 Phase 1에서 Sₐ/Sₜ를 분해하고 `structure` 필드를 두지만, 대응이 **구조적 근거**가 아니라 **표면 속성 유사**로 정당화되고 있지 않은지를 명시적으로 검사하는 규칙이 없다. `overextended`는 과잉 제약을 잡지만 이는 over-claiming 방어이지 표면-구조 혼동 방어가 아니다.

**4. 부재 — 2사례 비교(analogical encoding).** Gentner/Loewenstein/Thompson(2003)의 강한 발견(전이 48% vs 19%)은 *두 사례의 비교*가 스키마 추출을 촉발한다는 것이다. Analogia는 단일 source→target 매핑만 다루며, 두 구체 인스턴스를 나란히 제시해 공통 관계를 추상화하는 경로가 없다. 단 이는 추상 *형성*에 가까워 Periagoge(`/induce`)와 경계가 맞닿는다(SKILL.md L184의 colimit 라우팅 참조) — 무분별한 추가는 프로토콜 경계를 흐릴 수 있으므로 "검증 보조"로 한정해야 한다.

---

## 개선 함의 (이슈 #480)

위 충실도 갭은 이슈 #480의 `MappingLedger` 제안과 1:1로 대응한다. **아래는 문헌이 함의하는 설계 방향이며 채택된 사양이 아니다** — 실제 SKILL.md 반영은 별도 설계 결정이다.

- **1차 vs 고차 인과 관계 분리**(갭 #2 대응): `Correspondence`/fit map에 관계의 차수를 표기하고, Phase 2 선택을 정보이득 단독이 아니라 **systematicity 가중**(고차 인과 체계에 속한 대응 우선)으로 보강. SMT의 중심 예측을 프로토콜의 검증 우선순위로 들여오는 것.
- **base/target 객체 vs 관계 분리 + 표면 가드**(갭 #3 대응): MappingLedger의 "base objects / target objects / first-order relations / higher-order causal relations" 행 분리는 표면(객체 속성)과 구조(관계)를 구조적으로 갈라, 표면 유사 기반 대응의 통과를 차단.
- **forbidden inferences(+ licensed inferences)**(갭 #4 대응): `overextended`를 명시적 "금지된 추론" 산출로 승격하고, 타당한 매핑이 *허용하는* 후보 추론도 함께 표기하면 SMT의 추론 산출 단계를 온전히 반영.
- **analogical-encoding move**(갭 #5 대응): 두 구체 사례 비교 → 공통 관계 추상화 → target 적용. 효과크기(48% vs 19%)가 가장 큰 단일 개입이나, Periagoge와의 경계를 지켜 "검증 맥락에서의 보조"로 범위 한정.

---

## Cross-references

- `analogia/skills/ground/SKILL.md` (대상 프로토콜; Core Principle L130, fit map TYPES L46-65, Phase L196-285)
- `references/cognitive-psychology.md` §Analogia (1줄 인덱스 / 본 문서의 상위)
- `docs/analysis/horismos-philosophical-foundations.md` (동일 grounding-doc 템플릿)
- GitHub 이슈 #480 (MappingLedger + analogical-encoding move — 본 문서가 근거 기반)
- 경계: Periagoge `/induce`(추상 형성), Prothesis `/frame`(프레임워크 선택), Aitesis `/inquire`(사실 충분성) — Analogia는 *관계 대응* 검증에 한정(SKILL.md L184-186)

## 검증 상태 요약

| 참조 | 상태 | 근거 |
|---|---|---|
| Gentner 1983 | ✅ 검증 | 저자 PDF 본문 직접 추출(systematicity·관계>속성 인용) |
| Gentner/Loewenstein/Thompson 2003 | ✅ 검증 | 저자 PDF 본문 직접 추출(48% vs 19%, χ²=11.85, p<.01) |
| Holyoak & Koh 1987 | ✅ 검증 | PubMed 3670053 + 다수 인용 교차확인 |
| Gick & Holyoak 1980/1983 | ⚠️ 정전 인용 | Gentner 1983 본문이 인용; 효과크기 미재확인 |
| Gentner/Rattermann/Forbus 1993 | ⚠️ 정전 인용 | GentnerMarkman97 경유; 본 문서 직접 추출 안 함 |
