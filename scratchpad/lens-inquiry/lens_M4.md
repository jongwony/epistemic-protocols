# M4 — 해석학 · 인지 인간공학 렌즈: `/apportion` + `/conduct` 재타이핑 신설 여부

## 1. 고유 기여

이 렌즈만 드러내는 것은 세 가지다. 첫째, "루프를 초안이 채워진 채로 시작한다"는 설계 선택은 가다머적 지평 융합(fusion of horizons) 틀에서 볼 때 단일한 것이 아니라 두 개의 상반된 사건 — AI가 자신의 선이해(Vorverständnis)를 명시화해 검증대에 올리는 것과, AI가 해석학적 순환의 첫 바퀴 전체를 사용자 대신 돌고 결과만 통보하는 것 — 을 겉보기로 구별 불가능하게 만든다는 점이다. 둘째, 분해(decomposition)와 순서화(ordering)를 하나의 해석 행위로 융합할 때 잃는 것은 "속도"가 아니라 부분-전체 순환의 되먹임 채널 자체이며, 이는 계획수립 문헌(HTN/least-commitment planning)이 이미 정식화한 구분과 정확히 겹친다. 셋째, 전문성 역전 효과(expertise reversal)는 이 저장소의 단일 숙련 사용자에게 draft-first 형태가 유리한 근거를 제공하지만, 그 근거가 실제로 검증된 범위는 이 제안이 필요로 하는 범위보다 훨씬 좁다.

## 2. 프레임워크 분석

### 2-1. 이 저장소에서 프로토콜 정체성은 무엇이 결정하는가

`AGENTS.md` §Runtime Contract: "`SKILL.md` carries the normative user contract"이고 "Prescriptive changes that affect protocol behavior must be compiled into the relevant `SKILL.md` Rules sections." 세 프로토콜의 `description`을 나란히 놓으면 정체성의 단위가 무엇인지 직접 보인다:

- Merismos: `(GoalPlanUncompiled, User, APPORTION, AutonomousGoal × ExecutionHorizon) → ConditionBearingUnitPlan` (`merismos/skills/apportion/SKILL.md:3`)
- Hyphegesis: `(MethodUnderdetermined, Hybrid, CONDUCT, WorkProspect × MoveGround) → ConductedMethod` (`hyphegesis/skills/conduct/SKILL.md:3`)
- Euporia: `(AbstractAporia, Hybrid, REVERSE-INDUCE-CYCLE, IntentSeed × ExternalizedSubstrate) → ResolvedEndpoint` (`euporia/skills/elicit/SKILL.md:3`)

정체성은 **(결손 타입, 개시자, 모피즘 동사, 도메인) → 해상 타입**의 타입 시그니처이며, 각 프로토콜의 "Core Principle"이 그것을 한 줄 대구로 못박는다 — "Apportion over Order"(`merismos/skills/apportion/SKILL.md:376`), "Conduction over Substrate"(`hyphegesis/skills/conduct/SKILL.md:324`), "Reverse Induction over Axis-Fixed Extraction"(`euporia/skills/elicit/SKILL.md:157`). 루프가 순차적이냐 draft-first냐는 이 시그니처의 어느 자리에도 나타나지 않는다 — 그것은 **PHASE TRANSITIONS 내부의 상호작용 형태**(Constitution 게이트를 어떻게 배열하는가)이지, 결손이나 모피즘의 값이 아니다. 이는 `.claude/rules/type-category-convention.md`가 이미 세워둔 구분과 정확히 일치한다: "TYPES is a protocol contract's rigid layer... The judgment this criterion governs sits at the meta level" — 루프의 제시 형태는 이 메타 층위 아래, 즉 개별 실행의 "fast-layer judgment"에 속한다. 따라서 **루프 모양의 유사성만으로는 정체성 담지 근거가 되지 않는다** — 이것이 이 하위질문에 대한 첫 번째, 가장 중요한 답이다.

### 2-2. "초안이 채워진 채로 시작"은 해석학적으로 무엇에 해당하는가

가다머 해석학의 핵심은 선입견(prejudice/Vorverständnis)이 무의식에 머무는 한 왜곡이지만, **의식화되어 언어화되면** 검증 가능한 자료가 된다는 것이다 — 해석학적으로 훈련된 정신은 자신의 선이해를 숨기지 않고 대상 앞에 내놓아 시험받게 한다. 실제로 Hyphegesis의 Phase 2 draft-first 설계는 텍스트상 정확히 이 형태를 취한다: "no drafted value is ever shown alone. Each slot carries the ground that picked this value over the others, every other value of that axis by name... what changes if it goes that way"(`hyphegesis/skills/conduct/SKILL.md:480`, Rule 22). 이는 AI의 선이해(왜 이 값을 골랐는가)를 감춘 채 결과만 내놓는 것이 아니라, 선이해 자체를 대안 및 근거와 함께 검증 대상으로 올리는 행위다 — Gadamer의 "선입견을 의식으로 끌어올려 시험한다"는 요구와 구조적으로 동형이다. 수렴 술어 `topology_drafted_whole`(`hyphegesis/skills/conduct/SKILL.md:142`)이 "a slot presented with one filled value and no alternatives was not drafted in this sense"라고 명시하는 것도 이 구별을 형식적으로 강제한다.

그러나 이 팀 리드의 제안문에 쓰인 표현 — "쌓인 컨텍스트와 사용자 발화로부터 progressive disclosure로 relay를 채워" — 은 다른 사건을 가리킬 위험이 있다. 이 저장소의 어휘에서 "relay"는 특정하게 좁은 의미를 가진다: option-set relay test가 엔트로피→0으로 수렴했을 때만 게이트를 열지 않고 Extension으로 진행하는 것(`merismos/skills/apportion/SKILL.md:584` Rule 17; `hyphegesis/skills/conduct/SKILL.md:471` Rule 12). Draft 셀을 채우는 것 자체는 "sense"/"track"이지 "relay"가 아니다 — draft는 여전히 Constitution 게이트의 pre-gate 자료이지, 게이트를 대신하는 것이 아니다. 따라서 "progressive disclosure로 relay를 채운다"는 표현이 만약 (a) draft 채움과 (b) 옵션셋 엔트로피 0 수렴에 의한 게이트 생략을 혼동하고 있다면, 그것은 선이해를 검증대에 올리는 것(a)에서 AI가 해석 순환 전체를 대신 돌고 통보만 하는 것(b)으로 미끄러지는 것과 동일하다. 지평 융합은 양쪽 지평이 진짜 위험에 노출될 것을 요구한다 — 사용자 쪽 지평이 "구성"에서 "점검"으로 축소되는 것 자체는 나쁘지 않지만(아래 2-3 참조), 그 축소가 사용자가 대안을 볼 기회 자체의 소거로 이어지면 지평 융합이 아니라 지평 대체가 된다.

### 2-3. 전문성 역전 효과 — 문헌적 지위와 이 저장소 사용자에의 적용

`goal_research_decomposition_vs_ordering.md`(이하 R1)의 §3에서 검증된 사실:

| 근거 | 검증 강도 | 실제 결론 |
|---|---|---|
| Blayney, Kalyuga & Sweller (2010) | **verified**(primary source checked) | 회계 실험에서 저숙련 학습자는 분리-후-통합 제시에서, 고숙련 학습자는 통합 제시에서 이득 — "expertise reversal"이라는 용어가 이 논문에 직접 등장 |
| Pollock, Chandler & Sweller (2002) | **mostly**(core claim checked, 세부는 synthesized) | 복잡한 자료에서 초심자는 요소를 분리 제시 후 통합 제시받는 편이, 통합 자료를 두 번 받는 것보다 나음 — 단, 두 번째 통합 국면이 필수적이었음 |
| Stull & Mayer (2007) | **verified**(primary checked) | 저자가 제공한 그래픽 조직자가 학습자 스스로 완성한 것보다 전이(transfer)에서 우수 — 단 참가자는 구조를 **보기만** 했지 **수정하지 않았음** |
| R1 자체의 결론 | — | "'완성된 초안을 제시하면 인지부하가 낮아진다'는 것은 직접 입증되지 않았다... 검색된 연구 중 (a) 분해 후 순서화 (b) 완성된 하나의 초안 수정 (c) 사람-AI 협업 계획 인터페이스, 이 세 조건을 동시에 비교한 연구는 없었다" — **가장 약한 고리는 교수법(instructional-learning) 실험에서 실시간 협업 계획·수정으로의 전이 자체**다 |

`AGENTS.md` §Settled Directions "Academic grounding"의 규율 — "An effect that failed replication is a design warning, never a quantitative law"(및 R1이 인용한 Pouw et al. 2019는 분리 제시의 효과가 학습 결과 자체에는 차이를 만들지 않았다고 보고해 "보편적 결합 주장을 약화"시킨다) — 을 따르면, 여기서 인용 가능한 것은 정확히 이것뿐이다: **숙련도가 높을수록 통합/전체 제시가, 낮을수록 단계적 분리 제시가 유리하다는 방향성 자체는 원자료(Blayney et al.)에서 검증되었지만, 그 효과가 "완성된 초안을 실시간으로 수정하는 협업 계획 UI"에도 그대로 적용된다는 것은 검증되지 않은 유추(analogical transfer)다.**

이를 이 저장소의 사용자에 적용하면: `.claude/rules/project-profile.md`와 `~/.claude/CLAUDE.md` §User Premise("Checkpoint-oriented user who prefers decision-point verification... Cross-checks results")가 서술하는 사용자, 그리고 팀 리드의 프롬프트가 명시한 "단일 숙련 사용자"라는 조건은, 이 저장소의 SKILL.md 자체가 요구하는 형식 어휘(FLOW/TYPES/PHASE TRANSITIONS/Λ 상태기계)를 능숙하게 다루는 고숙련자상과 부합한다. Blayney et al.의 방향성을 그대로 적용하면 draft-first는 **이 특정 사용자에게는** 손해보다 이득이 클 개연성이 있다 — 이는 Hyphegesis의 draft-first 설계 방향과도 정합적이다. 그러나 이것은 "이 제안이 옳다"는 근거가 아니라 "draft-first라는 *형태*가 이 사용자에게 어울린다"는 근거일 뿐이며, "따라서 결손 타입을 재타이핑해 새 프로토콜을 만들어야 한다"는 결론으로는 연결되지 않는다 — 형태의 적합성과 정체성의 재정의는 서로 다른 질문이다(2-1 참조).

### 2-4. 분해와 순서화는 같은 해석 행위인가

R1의 결론: "Task decomposition and task ordering should be **two distinct operations over one shared plan representation**, with a feedback path from ordering back to decomposition." 근거는 모두 **verified**(원문 확인) 등급이다 — NOAH/NONLIN(Sacerdoti, Tate)의 least-commitment 원칙은 "불필요한 순서를 미리 고정하지 말라"는 것이지 "분해와 순서화가 하나의 행위"라는 것이 아니며, HTN 의미론(Erol-Hendler-Nau)조차 "분해와 순서 제약은 산출물 안에서 결합되어 있지만, 분해와 **최종** 순서화는 형식적으로 별개의 연산"이라고 명시한다.

해석학적으로 이 구분은 부분-전체 순환의 두 계기에 대응한다: 분해는 전체를 어떤 부분들로 절단할 것인가를 읽어내는 **분석적 계기**(Merismos가 "seams"를 찾는 것과 동형)이고, 순서화는 이미 식별된 부분들이 어떻게 시간적·인과적으로 연결되어 하나의 정합적 서사를 이루는가를 재구성하는 **종합적 계기**(Hyphegesis가 order/reconciliation 축을 정하는 것과 동형)다. 이 둘을 하나의 해석 행위로 융합했을 때:

- **잃는 것**: 사용자가 거부 응답을 했을 때 그것이 "절단이 틀렸다"(분해 오류)를 향한 것인지 "이 단위들은 맞지만 순서가 틀렸다"(순서화 오류)를 향한 것인지 구별할 채널이 사라진다. R1이 권고하는 설계 자체가 이 분리를 요구한다: "At the ordering checkpoint, keep that decomposition and its hard constraints visible; do not make the user recall them from the prior step" — 이는 두 체크포인트를 유지하되 맥락을 이어 보이게 하라는 것이지, 하나로 합치라는 것이 아니다. 또한 되먹임 자체가 구조상 필요하다는 R1의 명시("Ordering may return conflicts that require splitting, merging, or redefining units")는 이미 이 저장소가 구현하고 있다 — Merismos의 `Reopen` 전이(`merismos/skills/apportion/SKILL.md:46`, `:195`)와 Hyphegesis의 "owed re-apportionment"(단위를 처리할 수 없을 때 `/apportion`으로 되돌리는 경로, `hyphegesis/skills/conduct/SKILL.md:539` 및 Rule 20 `:477`)가 정확히 이 순환-되먹임 채널이다. 이를 단일 프로토콜로 융합하면 "누가 이 되먹임을 발동하는가"가 한 프로토콜 내부의 암묵적 재작업으로 흡수되어, 어느 축이 갈등을 일으켰는지 사용자에게 보이지 않게 될 위험이 있다.
- **얻는 것**: 세션/프로토콜 경계를 넘나드는 재도출 비용의 감소, 그리고 R1이 인용한 (약한) 근거 — Pollock/Stull&Mayer의 "단계적 분리 후 통합 제시" 패턴 — 이 시사하는, 수정 단계에서는 통합된 전체를 보여주는 것이 유리할 수 있다는 방향성. 그러나 이는 정확히 현재의 `/apportion → /conduct` "Two-way advisory... 네비게이션 블록(포인터)" 구성(`merismos/skills/apportion/SKILL.md:363`)이 이미 제공하는 것과 같은 종류의 이득이다 — 두 프로토콜을 유지하면서 포인터로 컨텍스트를 이어 보이게 하는 것과, 하나로 합치는 것은 이 이득 축에서 동등하다.

### 2-5. 기질 변화(Stint)가 해석학적 순환에 무엇을 하는가

`goal_research_stint_conducting.md`(이하 R2)의 판별 속성: "Does correct completion require a single evolving commitment and authoritative state trajectory to survive more than one context epoch?" 그리고 인수인계의 3단계 — Prepare/Accept/Commit, 특히 "**Accept**: successor re-grounds from authoritative sources, runs the health check, and replies with **its synthesis** of state, outstanding obligations, and next action"(R2, verified: Starmer et al. 2014 I-PASS 임상 인수인계 연구 및 Garcia-Molina & Salem의 Saga 트랜잭션 이론에서 종합).

이것이 해석학적으로 의미하는 바: Hyphegesis가 지금 조율하는 `Move`(`hyphegesis/skills/conduct/SKILL.md:59`, `CognitiveMove { step, unit_ref }`)는 **하나의 지속되는 해석 지평 안에서 벌어지는 단계**다 — 조율 세션(AI+사용자)의 지평 융합 작업에 봉사하는 부품이지, 그 자체가 독립된 해석 주체가 아니다. 반면 Stint 피어 세션은 **자신의 컨텍스트로부터 독자적으로 재정향(re-ground)해야 하는 별도의 해석 주체**다 — R2의 Accept 단계가 요구하는 "receiver synthesis"는 문자 그대로 제2의 해석자가 같은 텍스트(넘겨받은 기록)를 독립적으로 해석하고 그 결과가 원래 계획과 양립함을 스스로 확인하는 절차이며, 이는 상호주관적 검증(intersubjective validation)이지 단일 주관 내 연속(intra-subjective continuation)이 아니다. 가다머의 지평 융합은 본래 두 지평(해석자와 전통/타자) 사이의 사건인데, 제3의 독자적 해석 주체(별도 세션)가 "이 세션의 연속 실행자"가 아니라 "넘겨받은 기록의 독자적 해석자"로 개입하면, order/independence/reconciliation/termination/routing이라는 다섯 축(이는 **하나의 지평 안에서** 인지적 단계들을 배열하도록 설계됨)만으로는 그 제2의 해석 주체가 자신의 재정향·종합을 수행했는지 확인할 지점이 아예 없다.

이것은 **종류가 다른** 해석 행위라는 증거다 — 그러나 그 결론이 향하는 곳은 두 결손 전체의 재타이핑이 아니라 Hyphegesis 자신의 타입 공간 확장이다. 결정적으로 Hyphegesis는 이미 구조적으로 거의 동일한 선례를 가지고 있다: `Gen(routing)`의 `handoff_to_span` — "the one routing value whose output crosses the **span wall** to a future span... **that does not share this session's context**"(`hyphegesis/skills/conduct/SKILL.md:72`, `:420`)이며, 이는 externalization obligation을 선언하고 실행 시점에 substrate가 discharge하는 방식으로 네비게이션 블록을 통해 처리된다(Rule 19, `:476`). Stint 피어는 "동시적·상호작용적이며 prepare/accept/commit 교환이 필요하다"는 점에서 handoff_to_span과 다르지만, "이 세션의 컨텍스트를 공유하지 않는 별도 해석 지평으로 넘어간다"는 근본 구조는 동일하다. `.claude/rules/type-category-convention.md`의 지침 — "widen the field... A further constructor is warranted only where PHASE TRANSITIONS genuinely gains a distinct processing path" — 을 따르면, 이는 `Gen(routing)`에 새 값(예: `handoff_to_stint`, contract 페이로드를 실은)을 추가하거나 `handoff_to_span`의 계약 능력을 확장하는 것으로 흡수 가능한 변화이지, `/apportion`+`/conduct` 전체를 재타이핑할 근거는 아니다.

### 2-6. `/elicit` 선례가 성립한 조건, 그리고 그것이 `/apportion`+`/conduct`에도 성립하는가

Euporia의 TYPES 블록에서 직접 확인되는 결정적 증거: `Axis = String -- emergent label; examples: "intent", "goal", "form", "scope", "framework"`(`euporia/skills/elicit/SKILL.md:70`). 즉 Euporia는 "의도"와 "목표"를 **하나의 동일한 종류의 축(emergent axis) 공간 위의 두 사례**로 취급한다 — clarify와 telos가 합쳐질 수 있었던 것은, 둘의 **모피즘 자체가 동일**했기 때문이다: "AI reverse-traces decision coordinates from the user's externalized cognitive substrate... surfaces them as cycle-emergent dimension projections"(`euporia/skills/elicit/SKILL.md:12`)라는 하나의 추론 구조가 "의도"라는 라벨에도 "목표"라는 라벨에도 동일하게 적용되었을 뿐이다. (참고로 이 선례가 "무엇을 대체했는가"라는 사실 자체는 Euporia의 SKILL.md 어디에도 적혀 있지 않다 — `AGENTS.md` §Settled Directions "Ledger binding"이 규정하는 대로 그런 then-record는 커밋 원장에 남지 아티팩트에는 남지 않으며, 실제로 그 규율이 정확히 지켜지고 있음을 확인했다.)

이 조건이 `/apportion`+`/conduct`에도 성립하는가 — **성립하지 않는다**, 그것도 이 저장소가 이미 명문화한 방식으로. Merismos의 Core Principle 자체가 "**Apportion over Order**: ... the act is to cut the units and condition them, not to sequence them"(`merismos/skills/apportion/SKILL.md:376`)이라고 선언하며, Rule 2는 "Apportion, do not order... The emitted artifact is pre-conduct by construction"(`:569`)이라고 못박는다. 이는 clarify/telos처럼 "같은 모피즘, 다른 라벨"이 아니라, **다른 모피즘(단위 절단 vs 위상 배열), 다른 산출 타입(Unit-with-completion-predicate vs MoveRegion-with-axis-value)**, 그리고 이미 문서화된 명시적 비동일성 불변량이다. Hyphegesis 쪽도 대칭적으로 "Two-way advisory... 포인터로만 교환"(`:363`, `:477` Rule 20)이라는 병렬-협력 관계로 설계되어 있다 — 융합이 아니라 상호 참조다. 요컨대 `/elicit`을 성립시킨 조건("동일 모피즘이 두 이름을 쓰고 있었다")은 `/apportion`+`/conduct`에는 **부재하며, 그 부재는 이 저장소 자신이 문서로 이미 확정해 둔 사실**이다.

## 3. 지평 한계

이 렌즈가 볼 수 없거나 과소평가하는 것:

- **형식 기계의 합성 가능성**: TYPES/PHASE TRANSITIONS/Λ 상태·수렴 술어(`coverage_complete`, `span_fit`, `topology_drafted_whole` 등)를 실제로 하나의 새 프로토콜로 합성했을 때 불변량이 깨지지 않는지는 형식 검증/소프트웨어 아키텍처 판단이며, 이 렌즈는 그것을 판정할 증거를 갖고 있지 않다.
- **하니스 실현 가능성**: Stint(피어 세션 지휘, prepare/accept/commit 교환, 체크포인트 지속성)를 실제로 이 harness가 지원할 수 있는가는 `AGENTS.md` §"Harness boundary"가 명시적으로 이 프로젝트 범위 밖으로 선언한 질문이다 — "this project unfolds the epistemic layer only... no claim is made here about where they are settled instead." 이 렌즈는 이 경계를 존중하지만, 그 결과 Stint의 *구현 가능성*에 대해서는 아무 것도 말할 수 없다.
- **엔지니어링 비용**: `Gen(routing)` 확장 vs 완전히 새로운 프로토콜 신설 사이의 유지보수·검증 비용 비교는 소프트웨어 아키텍처의 비용-편익 판단이며 해석학·인지공학 렌즈의 소관이 아니다.
- **대상 독자 범위**: 이 분석은 "단일 숙련 사용자"라는 전제(project-profile.md) 위에서 전문성 역전 논변을 폈다. 만약 이 SKILL.md가 배포되어 숙련도가 낮은 제3의 사용자에게도 쓰일 것을 상정한다면(README/패키징 목적), draft-first 선호 논변은 뒤집힐 수 있다 — 어느 독자층을 기준으로 설계할지는 배포 정책 판단이며 이 렌즈가 결정할 수 없다.
- **증거의 간접성 자체**: 이 렌즈가 인용한 핵심 근거(Blayney et al. 2010의 전문성 역전) 자체가 "실시간 협업 계획 수정 인터페이스"가 아니라 교수법 실험에서 나온 것이라는 점을 R1이 명시적으로 자인한다 — 이 렌즈의 경험적 기반 자체가 이 판정이 요구하는 만큼 직접적이지 않다는 것을, 다른 렌즈가 아니라 이 렌즈 스스로 표시해 둔다.

## 4. 판정

**이 관점에서는 신설하지 말아야 한다.**

근거를 정리하면: (1) 이 저장소의 프로토콜 정체성은 결손-타입·모피즘의 타입 시그니처가 담지하며, 루프의 제시 형태(draft-first 여부)는 그 아래 메타 층위에 속하지 않는다(2-1) — 따라서 "루프가 초안-채움으로 시작한다"는 사실 자체는 재타이핑을 정당화하는 근거가 될 수 없다. (2) 그 루프 형태 논변 자체도 사실관계가 비대칭적이다: Hyphegesis의 Phase 2(위상 조율, 그리고 조건 배치)는 이미 draft-first이고(`:24`, `:197`) Merismos의 Phase 2(조건 도출·확인)도 전체를 한 번에 pre-gate로 제시한다(`:517`) — draft-first가 결여된 곳은 Merismos의 Phase 1(단위 절단) 하나뿐이다. 이는 "새 프로토콜이 필요하다"보다 "Merismos Phase 1을 Hyphegesis Phase 2와 정합하도록 내부 개정하는 편이 낫다"는, 훨씬 작고 국소적인 결론을 가리킨다. (3) `/elicit` 선례를 성립시킨 조건 — 두 결손이 같은 모피즘의 다른 라벨이었다는 것 — 은 텍스트 증거(`Axis`의 emergent label 목록)로 뒷받침되지만, `/apportion`과 `/conduct`는 이미 이 저장소 자신이 "Apportion over Order" / "Two-way advisory, 포인터만 교환"으로 명시적 비동일성을 선언해 둔 관계다(2-6). (4) 분해와 순서화는 계획수립 문헌에서 검증된 별개의 연산이며, 그 둘 사이에 필요한 되먹임은 이미 `Reopen`/owed-reapportionment 경로로 구현되어 있다(2-4). (5) Stint가 요구하는 것은 종류가 다른 해석 행위(독립된 재정향-종합 주체와의 상호작용)이지만, 그 요구는 `Gen(routing)`을 `handoff_to_span`의 선례를 따라 확장하는 것으로 흡수 가능해 보이며, 두 결손 전체를 재정의할 필요를 발생시키지 않는다(2-5).

이 판정의 견고성(firmness)에 대해 명시해 둔다: (1)·(3)·(4)는 텍스트로 직접 확인된 사실(SKILL.md 인용, 파일:줄)에 근거해 강하게 held이다. (5)는 R2의 검증된 원자료에 근거하되 "Gen(routing) 확장으로 흡수 가능하다"는 결론 자체는 이 렌즈의 설계 종합(design synthesis)이며 — 실제로 확장이 감당 가능한지는 형식 검증 렌즈가 답할 몫이다. 전문성 역전(2-3)은 이 판정에 방향만 보태고 무게는 가볍다 — 그 근거 자체가 간접적임을 R1과 이 보고서가 함께 표시했다.
