# Syneidesis 인지심리학 기반: 빈틈은 왜 안 보이며, /gap은 그 메커니즘을 얼마나 충실히 구현하는가

> 이 문서는 Syneidesis(`/gap`) 프로토콜의 인지심리학적 기반을 심층 검증한다.
> `references/cognitive-psychology.md`가 논문당 1줄 인덱스라면, 이 문서는 (1) 각 학술 참조의
> 진위와 정확한 특성을 외부 검증하고, (2) Syneidesis의 실제 메커니즘(`gap/SKILL.md`)이
> premortem·prospective hindsight·부작위편향·체크리스트 이론을 얼마나 충실히 구현하는지,
> 어디서 미달·발산하는지를 분석한다.
> Syneidesis의 Core Principle("Surfacing over Deciding")은 SKILL.md L100에 명시되어 있다.
> 후속 개선 이슈 #479의 근거 문서다.

---

## 배경: 빈틈이 안 보이는 두 인지적 원인

Syneidesis는 결정 시점에서 "놓친 빈틈"을 질문으로 표면화한다. 그런데 *왜* 사람은 빈틈을 놓치는가? 인지심리학은 두 독립 원인을 지목한다.

1. **부작위편향(omission bias)** — 잘못된 *행동*이 잘못된 *비행동*보다 더 나쁘게 느껴진다(Ritov & Baron 1990). 그 결과 "무언가를 하지 않아서" 생기는 위험은 체계적으로 과소평가된다. 백업을 *안 하는* 것, 검증을 *안 붙이는* 것의 위험이 누락의 형태로 시야에서 사라진다.
2. **미래 실패의 미명세** — 미래 사건은 추상적이라 실패 이유가 잘 떠오르지 않는다. 그런데 그 미래를 "이미 일어난 일"로 시제 전환하면(prospective hindsight) 이유 생성이 크게 늘어난다(Mitchell, Russo & Pennington 1989; 운영화는 Klein 2007의 premortem).

여기에 두 교정 장치가 결합된다: 짧고 실패모드에 결속된 **체크리스트**는 고위험 절차에서 실제로 누락을 줄이고(Pronovost et al. 2006; Haynes et al. 2009), **"반대를 고려하라"**는 명시적 지시는 확증/동화편향을 교정한다(Lord, Lepper & Preston 1984).

Syneidesis의 taxonomy(절차/고려/가정/대안)는 이 빈틈을 *탐지*하는 장치다. 이 문서의 핵심 질문은 — 탐지 장치가 위 *생성·교정* 메커니즘까지 충실히 담고 있는가다.

---

## 학술 참조 검증

각 항목은 Tavily 기반 외부 검증(2026-05) 결과다. 진위·핵심 발견·방법/효과/경계조건·재현성을 기록한다.

### Mitchell, Russo & Pennington (1989) — prospective hindsight

- **진위**: 검증됨. *Journal of Behavioral Decision Making*, 2(1), 25-38 (Wiley DOI 10.1002/bdm.3960020103).
- **핵심 발견**: 미래 사건을 "이미 일어났다"고 가정하고 설명을 생성하는 prospective hindsight가 결과에 대한 이유 식별을 향상시킨다.
- **방법·효과·경계조건**: 원논문의 조작은 *시제*(미래/과거)와 *확실성*(확실/불확실)의 2요인이다. 핵심은 단순한 "30% 증가"가 아니라 **확실성과의 상호작용**이다 — "확실한 사건"으로 가정하면 설명이 더 길고 episodic reason 비율이 높아지며, 그 효과는 *불확실* 조건에서 더 크게 나타났다. 널리 인용되는 "이유 30% 증가"는 Klein(2007)의 HBR recounting에서 대중화된 수치다.
- **경계조건(중요)**: 활성 성분은 "*실패할 수도 있다*"가 아니라 "*실패했다(확실)*"는 시제·확실성 전환이다. 이는 충실한 구현이 가정법(might fail)이 아니라 완료형(failed)을 써야 함을 함의한다.

### Klein (2007) — premortem

- **진위**: 검증됨. *Harvard Business Review*, 85(9). 원문 PDF 확보.
- **핵심 발견**: premortem은 postmortem의 가설적 반대다. "환자가 *이미 죽었다*"고 가정하고 "무엇이 잘못됐나"를 묻는다. Mitchell et al.(1989)의 prospective hindsight를 운영화하며, "이유 식별 능력 30% 향상"을 인용한다.
- **부수 효과**: 프로젝트에 과몰입한 사람의 "damn-the-torpedoes" 태도를 완화하고, 우려를 가진 반대자가 안전하게 발언하도록 만든다 — 단순 위험 나열을 넘는 사회적·동기적 이득.
- **경계조건**: HBR 실무 기법 기술이며 통제 실험이 아니다. 효과 근거는 Mitchell et al.에 의존한다.

### Pronovost et al. (2006) — 체크리스트 (ICU 카테터 감염)

- **진위**: 검증됨. *NEJM*, 355(26), 2725-2732 (PMID 17192537).
- **효과**: 103개 ICU, 375,757 카테터-일. 카테터 관련 혈류감염 median 2.7→0(3개월, P≤0.002), mean 7.7→1.4(16-18개월). 최대 **66% 감소가 18개월 지속**.
- **경계조건**: 단순 체크리스트만이 아니라 다면 개입(교육+절차+문화)의 일부다. 결속된 실패모드가 명확한 고반복 의료 절차라는 맥락.

### Haynes et al. (2009) — 수술 안전 체크리스트

- **진위**: 검증됨. *NEJM*, 360(5), 491-499 (PMID 19144931).
- **효과**: 8개 글로벌 병원. 사망률 1.5→0.8%(P=0.003), 입원 합병증 11.0→7.0%(P<0.001).
- **경계조건**: 효과는 체크리스트 자체보다 팀 커뮤니케이션·정착 효과 등 혼입 가능성이 학계에서 논의됨(NEJM 동반 코멘트 다수). 의료/항공 등 **실패모드가 열거 가능하고 반복적인 도메인**에서의 근거다.

### Lord, Lepper & Preston (1984) — consider-the-opposite

- **진위**: 검증됨. *JPSP*, 47(6), 1231-1243.
- **핵심 발견**: 사회적 판단의 여러 편향은 "신념과 어긋나는 가능성을 고려하지 못함"(Bacon)에서 비롯한다. 두 실험(편향적 동화 + 편향적 가설검증)에서 **"반대를 고려하라"는 명시적 유도가 "공정하고 편향 없이 하라"는 지시보다 교정 효과가 컸다.**
- **함의**: 일반적 "대안을 고려했나?"보다 *구조화된 반대 고려*가 강하다 — 노력 요구형 일반 지시는 약하다.

### Ritov & Baron (1990) — 부작위편향

- **진위**: 검증됨. *Journal of Behavioral Decision Making*, 3(4), 263-277 (DOI 10.1002/bdm.3960030404). 피인용 1183회.
- **핵심 발견**: 백신 자체가 해를 줄 수 있을 때, 순위험이 더 낮더라도 접종(행동)을 꺼린다. 행동/비행동 구분의 과잉일반화 = 부작위편향.
- **방법·경계조건**: 4개 실험, 학부생 151명, *가설적* 의사결정 — 실험실 외적 타당도는 제한적이나 현상 자체는 폭넓게 재현됨(고피인용).

---

## 이론 ↔ 프로토콜 매핑 충실도

Syneidesis의 실제 메커니즘은: `Scan(D) → GapPressureMap(load_bearing/cheap_to_settle/hidden_high_impact/nonblocking/queued) → Sel(≤2) → Surface(assertion-free Q) → Judge`. taxonomy는 절차/고려/가정/대안 + Emergent (SKILL.md L185-199).

| 이론 요소 | Syneidesis 구현 (SKILL.md) | 충실도 |
|---|---|---|
| **Prospective hindsight** (실패를 *확실*로 가정 → 이유 생성) | `Scan(D)`는 탐지 기반(L203-213). 실패-시뮬레이션 *생성* 무브 없음. `hidden_high_impact`(≤1, L221)가 unknown-unknown 표면이나 *이미 탐지된* 갭의 분류일 뿐 | **미달** — 생성 기법 미사용 |
| **부작위편향** (비행동 위험 과소평가) | taxonomy의 Procedural/Consideration이 누락을 잡지만 대칭적 처리. 활성 조건 `committed(D)`가 *상태변경·외부가시·자원소비 행동* 중심(L33, L163)이라 "안 하는 것"의 위험이 **활성 조건에서 구조적으로 빠짐**(L167 Scope limitation이 direction commitment 누락을 자인) | **미달** — 부작위 위험이 비활성 |
| **체크리스트** (짧고 실패모드 결속) | 개방형 `Scan` + Rule 2 "no gap inflation"(L305) + `|Gₛ|≤2`(L47) = "짧음"엔 부합. 그러나 유지되는 *도메인별 고위험 체크리스트*는 없음 | **부분** — 길이 정합, 안정 체크리스트 부재 |
| **Consider-the-opposite** (구조화된 반대 고려) | Alternative 타입 "was [alternative] considered?"(L192)는 약한 일반형. 명시적 "반대를 고려하라" 디바이어싱 무브는 없음 — Lord 1984가 약하다고 한 바로 그 일반 지시 형태 | **부분** — 약한 형태만 존재 |

**해석.** Syneidesis는 빈틈을 *탐지·분류·우선순위화*하는 데는 정교하다(GapPressureMap은 신호탐지적 선택 장치에 가깝다). 그러나 위 네 이론은 모두 *생성·교정* 메커니즘 — 빈틈을 **만들어내는** 절차다. 탐지가 못 본 것은 분류도 못 한다. 특히 `committed(D)`의 행동 중심 활성 조건은 부작위편향 문헌이 지목하는 바로 그 사각(비행동 위험)을 활성 단계에서 배제한다. 이는 우연이 아니라 활성 술어의 구조적 귀결이다.

---

## 개선 함의 (이슈 #479)

아래는 *문헌이 함의하는 설계 방향*이며 채택된 사양이 아니다. 각 항목은 위 충실도 갭에 근거한다.

1. **PremortemPass** — Scan 이전/병행으로 실패-시뮬레이션 생성 단계 추가: "이 결정이 *실패했다*고 가정 → 왜?". **경계조건 준수**: Mitchell 1989의 확실성 상호작용에 따라 가정법(might fail)이 아니라 완료형(failed)으로 프레이밍해야 활성 성분이 작동한다. 이는 `Scan`의 탐지 한계를 생성으로 보완한다.
2. **omission-risk를 1급 갭 타입으로** — 부작위편향(Ritov & Baron 1990)을 반영해 `committed(D)`를 비행동 위험까지 포착하도록 확장. 현 활성 술어는 omission을 구조적으로 과소탐지(L167이 이미 direction commitment 누락을 자인)하므로, 타입 추가만으로는 부족하고 **활성 조건 자체의 보정**이 필요하다.
3. **체크리스트 규율** — 도메인별 5~9항 *반복·열거 가능 실패모드* 체크리스트 유지(Pronovost/Haynes). **경계조건**: 체크리스트 근거는 실패모드가 열거 가능한 고반복 도메인(의료/항공)에서 나왔다. 개방형 판단 전체가 아니라 *재발하는 열거가능 실패모드*에만 적용해야 전이 타당도가 선다. Rule 2(no inflation)와 양립.
4. (부수) **Alternative 타입 강화** — Lord 1984에 따라 일반형 "대안 고려했나?"보다 구조화된 "반대를 고려하라"가 강하다. Alternative 질문형을 반대-고려 형태로 특화하는 선택지.

---

## Cross-references

- `syneidesis/skills/gap/SKILL.md` (대상 프로토콜; Core Principle L100, Gap Taxonomy L185, committed(D) L33/L163, GapPressureMap L215)
- `references/cognitive-psychology.md` §Mechanism 앵커 — Syneidesis (1줄 인덱스; 이 문서가 그 심층)
- 이슈 #479 — Syneidesis: PremortemPass + omission-risk gap type + checklist discipline (이 문서가 근거)
- `docs/analysis/horismos-philosophical-foundations.md` (동일 grounding 문서 패턴의 템플릿)
